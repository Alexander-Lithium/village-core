// Experiment 8: the suture. One villager's choices are steered by an outside "mind" on some days.
// Its needs, mood, memories and beliefs stay its own. Does the villager become like the mind?
// Every villager takes a turn as the subject. 60 days steered, then 30 days released.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { TABLES, fileName, createSim, V } from './engine.js';

const SEEDS = Array.from({ length: 10 }, (_, i) => 101 + i);
const CTRL = 60, TOTAL = 90;
const FRACTIONS = [0.25, 0.5, 0.75, 1];
const MINDS = {
  cold: { warmth: 'low', sociability: 'low', diligence: 'low', pride: 'high', honesty: 'low' },
  warm: { warmth: 'high', sociability: 'high', diligence: 'high', pride: 'low', honesty: 'high' },
  twin: 'twin',
  random: 'random',
};
const SET = process.argv[2] || 'consensus_blind8';
const tables = Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`tables/${SET}/${fileName(t)}`, 'utf8')]));
const num = l => V.levels.indexOf(l) - 1; // low -1, mid 0, high 1
const ET = V.effTraits; // warmth, sociability, diligence, pride

function snapAt(sim, id) {
  const n = sim.byId[id] || sim.npcs.find(x => x.id === id);
  const rels = Object.values(n.rel);
  let othersLike = 0, othersDislike = 0;
  for (const o of sim.npcs) { if (o.id === id) continue; const r = o.rel[id]; if (!r) continue;
    if (r.liking === 'like' || r.liking === 'close') othersLike++; else if (r.liking === 'dislike') othersDislike++; }
  return {
    eff: ET.map(t => num(n.eff[t])),
    pos: V.pairs.map(p => (n.beliefs[p].pole === 0 ? 1 : -1) * (n.beliefs[p].tier + 1)),
    friends: rels.filter(r => r.liking === 'like' || r.liking === 'close').length,
    enemies: rels.filter(r => r.liking === 'dislike').length,
    othersLike, othersDislike,
  };
}

function run(seed, subject, mindKey, fraction) {
  const suture = mindKey ? { subjects: [subject], mind: MINDS[mindKey], fraction, untilDay: CTRL } : null;
  const sim = createSim({ n: 20, days: TOTAL, runSeed: seed, logDecisions: false, suture }, tables);
  while (sim.day < CTRL) sim.stepTick();
  const at60 = snapAt(sim, subject);
  while (sim.day < TOTAL) sim.stepTick();
  const at90 = snapAt(sim, subject);
  const moves = { up: 0, down: 0, flip: 0, break: 0 };
  const movesRelease = { up: 0, down: 0, flip: 0, break: 0 };
  for (const s of sim.snapshots) for (const m of s.moves) { const [id, , mv] = m.split(':'); if (id === subject) { (s.day < CTRL ? moves : movesRelease)[mv]++; } }
  return { at60, at90, moves, movesRelease };
}

const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / Math.max(1, a.length - 1)); };
const ci = a => 1.96 * sd(a) / Math.sqrt(a.length);
const l1 = (a, b) => a.reduce((s, x, i) => s + Math.abs(x - b[i]), 0);

const t0 = Date.now();
const probe = createSim({ n: 20, days: 1, logDecisions: false }, tables);
const IDS = probe.npcs.map(n => n.id);
const initialEff = Object.fromEntries(probe.npcs.map(n => [n.id, ET.map(t => num(n.eff[t]))]));
const temperament = Object.fromEntries(probe.npcs.map(n => [n.id, n.temperament]));

// Baselines
const base = {};
for (const seed of SEEDS) for (const id of IDS) base[`${seed}:${id}`] = run(seed, id, null, 0);

const results = {};
const raw = [];
for (const mindKey of Object.keys(MINDS)) {
  for (const f of FRACTIONS) {
    const rows = [];
    for (const seed of SEEDS) for (const id of IDS) {
      const r = run(seed, id, mindKey, f), b = base[`${seed}:${id}`];
      const target = typeof MINDS[mindKey] === 'object' ? ET.map(t => num(MINDS[mindKey][t])) : null;
      const row = {
        seed, id,
        // toward-mind: how much closer the villager's traits are to the mind than in its unsteered life (positive = converged)
        toward60: target ? l1(b.at60.eff, target) - l1(r.at60.eff, target) : null,
        toward90: target ? l1(b.at90.eff, target) - l1(r.at90.eff, target) : null,
        traitShift60: l1(r.at60.eff, b.at60.eff), traitShift90: l1(r.at90.eff, b.at90.eff),
        beliefShift60: l1(r.at60.pos, b.at60.pos), beliefShift90: l1(r.at90.pos, b.at90.pos),
        dWorth60: r.at60.pos[V.pairs.indexOf('worth')] - b.at60.pos[V.pairs.indexOf('worth')],
        dTrust60: r.at60.pos[V.pairs.indexOf('trust')] - b.at60.pos[V.pairs.indexOf('trust')],
        dFriends60: r.at60.friends - b.at60.friends, dEnemies60: r.at60.enemies - b.at60.enemies,
        dFriends90: r.at90.friends - b.at90.friends, dEnemies90: r.at90.enemies - b.at90.enemies,
        dOthersLike60: r.at60.othersLike - b.at60.othersLike, dOthersDislike60: r.at60.othersDislike - b.at60.othersDislike,
        moves: r.moves.up + r.moves.down + r.moves.flip + r.moves.break, baseMoves: b.moves.up + b.moves.down + b.moves.flip + b.moves.break,
        breaks: r.moves.break, baseBreaks: b.moves.break, flips: r.moves.flip, baseFlips: b.moves.flip,
      };
      rows.push(row); raw.push({ mind: mindKey, fraction: f, ...row });
    }
    const keys = Object.keys(rows[0]).filter(k => !['seed', 'id'].includes(k) && rows[0][k] !== null);
    const summ = {};
    for (const k of keys) { const v = rows.map(x => x[k]); summ[k] = { mean: mean(v), ci: ci(v) }; }
    results[`${mindKey}@${f}`] = summ;
  }
}
// Who resists? (cold mind, 100%): convergence vs subject's flexibility and initial distance
const resist = IDS.map(id => {
  const rs = raw.filter(x => x.mind === 'cold' && x.fraction === 1 && x.id === id);
  return { id, flexibility: temperament[id].flexibility, warmth: temperament[id].warmth,
    startDist: l1(initialEff[id], ET.map(t => num(MINDS.cold[t]))),
    toward60: mean(rs.map(x => x.toward60)), toward90: mean(rs.map(x => x.toward90)), breaks: mean(rs.map(x => x.breaks)) };
});

mkdirSync('reports', { recursive: true });
writeFileSync(`reports/exp8_suture_${SET}.json`, JSON.stringify({ set: SET, seeds: SEEDS, ctrlDays: CTRL, totalDays: TOTAL, results, resist }, null, 1));
writeFileSync(`reports/exp8_suture_${SET}_raw.json`, JSON.stringify(raw));

const f2 = (o, d = 2) => `${o.mean.toFixed(d)}±${o.ci.toFixed(d)}`;
console.log(`set ${SET}; ${Object.keys(base).length} baselines; ${raw.length} steered runs; ${((Date.now() - t0) / 1000).toFixed(1)} s`);
console.log('mind@frac | toward60 toward90 | traitShift60/90 | beliefShift60/90 | dWorth60 dTrust60 | dFriends60/90 dEnemies60/90 | othersLike/Dislike60 | moves(base) breaks(base) flips(base)');
for (const [k, s] of Object.entries(results)) {
  console.log(`${k.padEnd(10)} | ${s.toward60 ? f2(s.toward60) : '   -   '} ${s.toward90 ? f2(s.toward90) : '   -   '} | ${f2(s.traitShift60)} ${f2(s.traitShift90)} | ${f2(s.beliefShift60)} ${f2(s.beliefShift90)} | ${f2(s.dWorth60)} ${f2(s.dTrust60)} | ${f2(s.dFriends60)} ${f2(s.dFriends90)} ${f2(s.dEnemies60)} ${f2(s.dEnemies90)} | ${f2(s.dOthersLike60)} ${f2(s.dOthersDislike60)} | ${s.moves.mean.toFixed(1)}(${s.baseMoves.mean.toFixed(1)}) ${s.breaks.mean.toFixed(2)}(${s.baseBreaks.mean.toFixed(2)}) ${s.flips.mean.toFixed(2)}(${s.baseFlips.mean.toFixed(2)})`);
}
console.log('\nresistance (cold@100%):');
for (const r of resist) console.log(`${r.id} flex=${r.flexibility} warmth=${r.warmth} startDist=${r.startDist} toward60=${r.toward60.toFixed(2)} toward90=${r.toward90.toFixed(2)} breaks=${r.breaks.toFixed(1)}`);
