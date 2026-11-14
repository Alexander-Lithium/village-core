// Compares teacher fills and builds a consensus table set.
// Usage: node compare_fills.js --sets a_r1,a_r2,b_r1,... [--consensus blindA_r1,...] [--name consensus_blind] [--out reports/x.md]
//   Set names should look like <arm>_r<run> (e.g. gemini_r1) so self-consistency can be computed.
//   --consensus: which sets vote for the consensus (default: all sets). Ties are broken by the
//   rule-table value if it is among the tied values, else by the first value in vocabulary order; every tie is listed.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { TABLE_BY_ID, loadTable, normalise, fileName, grid } from './engine.js';
import { PASTES } from './gen_prompt_pack.js';

const TEACHER = PASTES.flat().sort((a, b) => +a.slice(1) - +b.slice(1));
const readSet = name => Object.fromEntries(TEACHER.map(tid => {
  const t = TABLE_BY_ID[tid];
  return [tid, loadTable(t, readFileSync(`tables/${name}/${fileName(t)}`, 'utf8'), true).map];
}));
const armOf = s => s.replace(/_r\d+$/, '');
const pct = (a, b) => (b ? (100 * a / b).toFixed(0) + '%' : '–');

function args() {
  const a = {}; const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i += 2) a[v[i].replace(/^--/, '')] = v[i + 1];
  return a;
}

export function compare(setNames, voterNames, consensusName) {
  const sets = Object.fromEntries(setNames.map(n => [n, readSet(n)]));
  const rules = readSet('rules');
  const keysOf = tid => grid(TABLE_BY_ID[tid]).map(g => g.join('|'));
  const lines = [];
  const consensus = {}, ties = [], unstable = [];

  // Consensus by majority per output column across voters
  for (const tid of TEACHER) {
    const t = TABLE_BY_ID[tid];
    const map = new Map();
    for (const k of keysOf(tid)) {
      const inp = k.split('|');
      const ro = Object.fromEntries(t.inputs.map((c, i) => [c[0], inp[i]]));
      const out = t.outputs.map(([col, allowed], ci) => {
        const counts = new Map();
        for (const v of voterNames) { const x = sets[v][tid].get(k)?.[ci]; if (x !== undefined) counts.set(x, (counts.get(x) || 0) + 1); }
        const max = Math.max(0, ...counts.values());
        const top = [...counts].filter(([, c]) => c === max).map(([x]) => x);
        if (top.length === 1) return top[0];
        const al = allowed(ro);
        const rv = rules[tid].get(k)[ci];
        const pick = top.includes(rv) ? rv : al.find(x => top.includes(x)) ?? rv;
        ties.push(`${tid} ${k} · ${col}: ${top.join(' / ')} → ${pick}`);
        return pick;
      });
      map.set(k, out);
    }
    consensus[tid] = map;
  }

  // Agreement tables
  const agree = (A, B, tid) => { let n = 0, m = 0; for (const k of keysOf(tid)) { n++; if (A[tid].get(k)?.join('|') === B[tid].get(k)?.join('|')) m++; } return [m, n]; };
  lines.push('## Row agreement with the consensus (whole row identical)\n');
  lines.push('| Set | ' + TEACHER.map(t => `${t} ${TABLE_BY_ID[t].name}`).join(' | ') + ' | All |');
  lines.push('|' + ' --- |'.repeat(TEACHER.length + 2));
  const cons = consensus;
  for (const n of [...setNames, 'rules']) {
    const S = n === 'rules' ? rules : sets[n];
    let M = 0, N = 0;
    const cells = TEACHER.map(tid => { const [m, k] = agree(S, cons, tid); M += m; N += k; return pct(m, k); });
    lines.push(`| ${n}${voterNames.includes(n) ? '' : ' *(not voting)*'} | ${cells.join(' | ')} | ${pct(M, N)} |`);
  }

  // Self-consistency within arms
  const arms = {};
  for (const n of setNames) (arms[armOf(n)] = arms[armOf(n)] || []).push(n);
  lines.push('\n## Self-consistency (run 1 vs run 2 of the same arm)\n');
  lines.push('| Arm | ' + TEACHER.join(' | ') + ' | All |');
  lines.push('|' + ' --- |'.repeat(TEACHER.length + 2));
  for (const [arm, runs] of Object.entries(arms)) {
    if (runs.length < 2) continue;
    let M = 0, N = 0;
    const cells = TEACHER.map(tid => { const [m, k] = agree(sets[runs[0]], sets[runs[1]], tid); M += m; N += k; return pct(m, k); });
    lines.push(`| ${arm} | ${cells.join(' | ')} | ${pct(M, N)} |`);
    for (const tid of TEACHER) for (const k of keysOf(tid))
      if (sets[runs[0]][tid].get(k)?.join('|') !== sets[runs[1]][tid].get(k)?.join('|'))
        unstable.push(`${arm} · ${tid} ${k}: ${sets[runs[0]][tid].get(k)?.join('/')} vs ${sets[runs[1]][tid].get(k)?.join('/')}`);
  }

  // Pairwise matrix (all tables pooled)
  lines.push('\n## Pairwise agreement (all 240 rows)\n');
  lines.push('| | ' + setNames.join(' | ') + ' |');
  lines.push('|' + ' --- |'.repeat(setNames.length + 1));
  for (const a of setNames) {
    const cells = setNames.map(b => { let M = 0, N = 0; for (const tid of TEACHER) { const [m, k] = agree(sets[a], sets[b], tid); M += m; N += k; } return pct(M, N); });
    lines.push(`| ${a} | ${cells.join(' | ')} |`);
  }

  // Row-level disagreement across all sets
  const rowsSplit = [];
  for (const tid of TEACHER) for (const k of keysOf(tid)) {
    const vals = new Set(setNames.map(n => sets[n][tid].get(k)?.join('/')));
    if (vals.size > 1) rowsSplit.push(`${tid} ${k}: ` + setNames.map(n => `${n}=${sets[n][tid].get(k)?.join('/')}`).join(', '));
  }
  lines.push(`\n## Consensus ties (${ties.length})\n` + (ties.map(x => '- ' + x).join('\n') || '- none'));
  lines.push(`\n## Rows that differ between runs of the same arm (${unstable.length})\n` + (unstable.map(x => '- ' + x).join('\n') || '- none'));
  lines.push(`\n## Rows where not all sets agree (${rowsSplit.length} of 240)\n<details><summary>show</summary>\n\n` + rowsSplit.map(x => '- ' + x).join('\n') + '\n\n</details>');

  if (consensusName) {
    const dir = `tables/${consensusName}`;
    mkdirSync(dir, { recursive: true });
    for (const tid of ['T1', 'T11']) copyFileSync(`tables/rules/${fileName(TABLE_BY_ID[tid])}`, `${dir}/${fileName(TABLE_BY_ID[tid])}`);
    for (const tid of TEACHER) writeFileSync(`${dir}/${fileName(TABLE_BY_ID[tid])}`, normalise(TABLE_BY_ID[tid], consensus[tid]));
  }
  return `# Teacher fill comparison\n\nSets: ${setNames.join(', ')}\nConsensus voters: ${voterNames.join(', ')}${consensusName ? `\nConsensus written to tables/${consensusName}` : ''}\n\n` + lines.join('\n') + '\n';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = args();
  const setNames = a.sets.split(',');
  const voters = a.consensus ? a.consensus.split(',') : setNames;
  const report = compare(setNames, voters, a.name);
  if (a.out) { mkdirSync(a.out.replace(/\/[^/]+$/, ''), { recursive: true }); writeFileSync(a.out, report); }
  console.log(report.split('\n## Consensus ties')[0]);
}
