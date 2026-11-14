// Where do teacher fills disagree, how much is noise vs model temperament, and how often
// do villagers actually hit those rows? Usage comes from running the village on the blind consensus tables.
// Usage: node analyse_disagreement.js  -> prints tables and writes reports/disagreement.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { TABLES, loadTable, fileName, createSim } from './engine.js';

const T = TABLES.filter(t => t.type === 'teacher');
const ARMS = { opusnormal: ['opusnormal_r1', 'opusnormal_r2'], opusblind: ['opusblind_r1', 'opusblind_r2'], gemini: ['gemini_r1', 'gemini_r2'], chatgpt: ['chatgpt_r1', 'chatgpt_r2'] };
const BLIND = Object.values(ARMS).flat();
const load = s => Object.fromEntries(T.map(t => [t.id, loadTable(t, readFileSync(`tables/${s}/${fileName(t)}`, 'utf8'), true).map]));
const D = Object.fromEntries([...BLIND, 'consensus_blind8', 'dev_r1'].map(s => [s, load(s)]));
const NAMES = { T2: 'where to go', T3: 'stance toward someone', T4: 'what to do', T5: 'apologise?', T6: 'reaction: trust events', T7: 'reaction: status events', T8: 'reaction: work outcome', T9: 'mood change', T10: 'grudge', T12: 'belief → behaviour' };

// 1. Usage counts: 20 seeds x 30 days x 20 villagers on consensus tables
const texts = Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`tables/consensus_blind8/${fileName(t)}`, 'utf8')]));
const uses = {}; // tid|key -> {n, first, second}
for (let seed = 1; seed <= 20; seed++) {
  const sim = createSim({ runSeed: seed, n: 20, days: 30, logDecisions: true }, texts).runAll();
  for (let i = 1; i < sim.logLines.length; i++) {
    const f = sim.logLines[i].split(',');
    const id = f[2] + '|' + f[3];
    const u = uses[id] || (uses[id] = { n: 0, first: 0, second: 0 });
    u.n++; if (f[5] === 'first') u.first++; if (f[5] === 'second') u.second++;
  }
}
const totalLookups = Object.values(uses).reduce((a, u) => a + u.n, 0);

// 2. Per cell: noise (run1 != run2 within an arm) and temperament (arms disagree although each is self-consistent)
const res = {};
let grand = { lookups: 0, noiseW: 0, tempW: 0, anyDiffW: 0 };
for (const t of T) {
  const cols = t.outputs.map(o => o[0]);
  const r = res[t.id] = { name: NAMES[t.id], rows: 0, lookups: 0, cols: {}, rowsUnanimous: 0, usedLookupsContested: 0 };
  for (const c of cols) r.cols[c] = { cells: 0, noisy: 0, temperament: 0, stable: 0, wNoise: 0, wTemp: 0, wAll: 0, lookups: 0 };
  for (const k of D.consensus_blind8[t.id].keys()) {
    r.rows++;
    const u = uses[t.id + '|' + k] || { n: 0, first: 0, second: 0 };
    r.lookups += u.n;
    const all = BLIND.map(b => D[b][t.id].get(k).join('|'));
    if (new Set(all).size === 1) r.rowsUnanimous++; else r.usedLookupsContested += u.n;
    cols.forEach((c, ci) => {
      // weight: how often this column's value is actually used
      let w = u.n;
      if (t.id === 'T2' || t.id === 'T4') w = ci === 0 ? u.first : u.second;
      const cell = r.cols[c];
      cell.cells++; cell.lookups += w;
      const armVals = Object.values(ARMS).map(runs => runs.map(x => D[x][t.id].get(k)[ci]));
      const noisyArms = armVals.filter(v => v[0] !== v[1]).length;          // arms that disagree with themselves
      const noiseRate = noisyArms / armVals.length;
      const selfConsistent = armVals.filter(v => v[0] === v[1]).map(v => v[0]);
      const temperament = new Set(selfConsistent).size > 1;                // stable arms giving different answers
      const allSame = new Set(armVals.flat()).size === 1;
      if (allSame) cell.stable++; else if (temperament) cell.temperament++; else cell.noisy++;
      // weighted: chance a random fill differs from consensus on this cell, times usage
      const cons = D.consensus_blind8[t.id].get(k)[ci];
      const pDiff = BLIND.filter(b => D[b][t.id].get(k)[ci] !== cons).length / BLIND.length;
      cell.wAll += w * pDiff; cell.wNoise += w * noiseRate * 0.5; cell.wTemp += w * (temperament ? 1 : 0);
    });
  }
}

// 3. Per fill: share of actual decisions (as used by villagers) where that fill's answer differs from consensus
const perFill = {};
for (const s of [...BLIND, 'dev_r1']) {
  let w = 0, d = 0;
  for (const t of T) for (const k of D.consensus_blind8[t.id].keys()) {
    const u = uses[t.id + '|' + k]; if (!u) continue;
    const a = D[s][t.id].get(k), c = D.consensus_blind8[t.id].get(k);
    t.outputs.forEach((o, ci) => {
      const ww = (t.id === 'T2' || t.id === 'T4') ? (ci === 0 ? u.first : u.second) : u.n;
      w += ww; if (a[ci] !== c[ci]) d += ww;
    });
  }
  perFill[s] = { decisionsDiffering: d / w };
}

// Print
const pct = x => (100 * x).toFixed(0) + '%';
console.log(`Lookups counted: ${totalLookups.toLocaleString()} (20 seeds x 30 days x 20 villagers, consensus tables)\n`);
console.log('table'.padEnd(26), 'share of all lookups'.padEnd(21), 'rows unanimous'.padEnd(15), 'lookups on contested rows');
for (const t of T) { const r = res[t.id]; console.log(r.name.padEnd(26), pct(r.lookups / totalLookups).padEnd(21), `${r.rowsUnanimous}/${r.rows}`.padEnd(15), pct(r.lookups ? r.usedLookupsContested / r.lookups : 0)); }
console.log('\nPer answer column: stable / noise (a model disagrees with itself) / temperament (models consistently differ)');
for (const t of T) for (const [c, v] of Object.entries(res[t.id].cols)) {
  console.log(`${res[t.id].name} · ${c}`.padEnd(42), `stable ${v.stable}/${v.cells}`.padEnd(14), `noise ${v.noisy}`.padEnd(10), `temperament ${v.temperament}`.padEnd(16),
    `usage-weighted chance a fill differs from consensus: ${pct(v.lookups ? v.wAll / v.lookups : 0)}`);
}
console.log('\nShare of real decisions where each fill would answer differently from the consensus:');
for (const [s, v] of Object.entries(perFill)) console.log(' ', s.padEnd(14), pct(v.decisionsDiffering));
mkdirSync('reports', { recursive: true });
writeFileSync('reports/disagreement.json', JSON.stringify({ totalLookups, tables: res, perFill }, null, 1));
