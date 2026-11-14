// Experiment 3: do the same 20 villagers live different lives across seeds, and does that depend on
// the belief loop, their traits, and the psychology in the tables?
// Seeds 101-150 (never used for calibration). 60 days. Writes reports/exp3.json.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { TABLES, fileName, createSim, V } from './engine.js';

export const SEEDS = Array.from({ length: 50 }, (_, i) => 101 + i);
export const DAYS = 60;
export const readSet = d => Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`tables/${d}/${fileName(t)}`, 'utf8')]));
const NEG = new Set(V.negativeActs);

export function runOne(tables, cfg) {
  const sim = createSim({ n: 20, days: DAYS, logDecisions: true, ...cfg }, tables).runAll();
  const acts = {}, neg = {};
  for (let i = 1; i < sim.eventLog.length; i++) {
    const f = sim.eventLog[i].split(',');
    if (f[2] === '-' || f[4] === 'apologise') continue;
    acts[f[2]] = (acts[f[2]] || 0) + 1;
    if (NEG.has(f[4])) neg[f[2]] = (neg[f[2]] || 0) + 1;
  }
  const villagers = sim.npcs.map(n => {
    const rels = Object.values(n.rel);
    return {
      id: n.id,
      beliefs: V.pairs.map(p => (n.beliefs[p].pole === 0 ? 1 : -1) * (n.beliefs[p].tier + 1)),
      friends: rels.filter(r => r.liking === 'like' || r.liking === 'close').length,
      enemies: rels.filter(r => r.liking === 'dislike').length,
      negShare: (neg[n.id] || 0) / Math.max(1, acts[n.id] || 0),
    };
  });
  const s = sim.summary();
  const last = s.dailyMetrics[s.dailyMetrics.length - 1];
  const moves = { up: 0, down: 0, flip: 0, break: 0 };
  for (const d of s.dailyMetrics) for (const k in moves) moves[k] += d.moves[k];
  const totalActs = Object.values(acts).reduce((a, b) => a + b, 0), totalNeg = Object.values(neg).reduce((a, b) => a + b, 0);
  return { village: { friendships: last.friendships, feuds: last.feuds, isolates: last.isolates, flips: moves.flip, breaks: moves.break,
    beliefMoves: moves.up + moves.down + moves.flip + moves.break, negShare: totalNeg / totalActs }, villagers };
}

const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1)); };
const ci = a => 1.96 * sd(a) / Math.sqrt(a.length);
const l1 = (a, b) => a.reduce((s, x, i) => s + Math.abs(x - b[i]), 0);

// Spread of one villager across seeds
function spreadOf(runs) {
  const per = runs[0].villagers.map((_, vi) => {
    const prof = runs.map(r => r.villagers[vi].beliefs);
    let d = 0, c = 0;
    for (let i = 0; i < prof.length; i++) for (let j = i + 1; j < prof.length; j++) { d += l1(prof[i], prof[j]); c++; }
    return {
      beliefDist: d / c,
      distinctProfiles: new Set(prof.map(p => p.join())).size,
      friendsSD: sd(runs.map(r => r.villagers[vi].friends)),
      negShareSD: sd(runs.map(r => r.villagers[vi].negShare)),
    };
  });
  return { beliefDist: mean(per.map(p => p.beliefDist)), distinctProfiles: mean(per.map(p => p.distinctProfiles)),
    friendsSD: mean(per.map(p => p.friendsSD)), negShareSD: mean(per.map(p => p.negShareSD)), per };
}
// Bootstrap CI over seeds for spread measures (spread is computed across seeds, so resample seeds)
function bootSpread(runs, key, reps = 200) {
  let st = 12345;
  const rnd = n => { st = (Math.imul(st, 1103515245) + 12345) >>> 0; return st % n; };
  const vals = [];
  for (let r = 0; r < reps; r++) vals.push(spreadOf(runs.map(() => runs[rnd(runs.length)]))[key]);
  vals.sort((a, b) => a - b);
  return [vals[Math.floor(0.025 * reps)], vals[Math.floor(0.975 * reps)]];
}

export function summarise(runs) {
  const v = k => runs.map(r => r.village[k]);
  const sp = spreadOf(runs);
  const out = { spread: {}, village: {} };
  for (const k of ['beliefDist', 'distinctProfiles', 'friendsSD', 'negShareSD']) out.spread[k] = { value: sp[k], ci: bootSpread(runs, k) };
  for (const k of ['friendships', 'feuds', 'isolates', 'flips', 'breaks', 'beliefMoves', 'negShare'])
    out.village[k] = { mean: mean(v(k)), ci: ci(v(k)), sd: sd(v(k)), min: Math.min(...v(k)), max: Math.max(...v(k)) };
  out.perVillager = sp.per;
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const cons = readSet('consensus_blind8');
  const conds = {
    'consensus': [cons, {}],
    'consensus, loop off': [cons, { loopOff: true }],
    'consensus, traits off': [cons, { traitsOff: true }],
    'consensus, shuffled tables': [cons, { tablesMode: 'shuffled' }],
    'consensus, random tables': [cons, { tablesMode: 'random' }],
    'rule tables (hand-written)': [readSet('rules'), {}],
  };
  for (const f of ['opusnormal_r1', 'opusnormal_r2', 'opusblind_r1', 'opusblind_r2', 'gemini_r1', 'gemini_r2', 'chatgpt_r1', 'chatgpt_r2', 'dev_r1'])
    conds['fill: ' + f] = [readSet(f), {}];
  const results = {}, raw = {};
  for (const [name, [tables, cfg]] of Object.entries(conds)) {
    const t0 = Date.now();
    const runs = SEEDS.map(seed => runOne(tables, { ...cfg, runSeed: seed }));
    raw[name] = runs;
    results[name] = summarise(runs);
    process.stderr.write(`${name}: ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
  }
  mkdirSync('reports', { recursive: true });
  writeFileSync('reports/exp3.json', JSON.stringify({ seeds: SEEDS, days: DAYS, results }, null, 1));
  writeFileSync('reports/exp3_raw.json', JSON.stringify(raw));
  const f = (x, d = 1) => x.toFixed(d);
  console.log('SPREAD OF LIVES (same 20 villagers, 50 seeds, 60 days)');
  console.log('condition'.padEnd(30), 'belief distance'.padEnd(20), 'distinct endings'.padEnd(18), 'SD friends'.padEnd(18), 'SD unkind-act share');
  for (const [n, r] of Object.entries(results)) {
    const s = r.spread;
    console.log(n.padEnd(30), `${f(s.beliefDist.value, 2)} [${f(s.beliefDist.ci[0], 2)}–${f(s.beliefDist.ci[1], 2)}]`.padEnd(20),
      `${f(s.distinctProfiles.value)}/50`.padEnd(18), `${f(s.friendsSD.value, 2)} [${f(s.friendsSD.ci[0], 2)}–${f(s.friendsSD.ci[1], 2)}]`.padEnd(18),
      `${f(100 * s.negShareSD.value, 1)}pp [${f(100 * s.negShareSD.ci[0], 1)}–${f(100 * s.negShareSD.ci[1], 1)}]`);
  }
  console.log('\nVILLAGE OUTCOMES (mean ± 95% CI over 50 seeds)');
  console.log('condition'.padEnd(30), ['friendships', 'feuds', 'isolates', 'belief moves', 'breaks', 'unkind acts'].map(x => x.padEnd(14)).join(''));
  for (const [n, r] of Object.entries(results)) {
    const v = r.village;
    console.log(n.padEnd(30), [v.friendships, v.feuds, v.isolates, v.beliefMoves, v.breaks].map(x => `${f(x.mean)}±${f(x.ci)}`.padEnd(14)).join('') + `${f(100 * v.negShare.mean)}%±${f(100 * v.negShare.ci)}`);
  }
}
