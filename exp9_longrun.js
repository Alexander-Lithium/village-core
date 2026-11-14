// Experiment 9 (added after AI-mediated reviewer analysis): does a large village stay alive over a long time?
// 1,000 villagers (50 hamlets of 20), 1,000 days, consensus tables, 5 seeds. Checkpoint every 50 days.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { TABLES, fileName, createSim, V } from './engine.js';

const SET = process.argv[2] || 'consensus_blind8';
const SEEDS = (process.argv[3] || '101,102,103,104,105').split(',').map(Number);
const N = 1000, DAYS = 1000, EVERY = 50;
const tables = Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`tables/${SET}/${fileName(t)}`, 'utf8')]));
const NEG = new Set(['argued with', 'interrupted', 'ignored', 'credit taken']);
const SOCIAL = new Set(['helped', 'chatted with', 'shared food with', 'argued with', 'interrupted', 'praised', 'ignored', 'credit taken', 'apologised to']);
const pos = n => V.pairs.map(p => (n.beliefs[p].pole === 0 ? 1 : -1) * (n.beliefs[p].tier + 1));

const out = [];
for (const seed of SEEDS) {
  const t0 = Date.now();
  const sim = createSim({ n: N, days: DAYS, runSeed: seed, logDecisions: false }, tables);
  let prevProf = sim.npcs.map(n => pos(n).join()), prevRel = null, prevEff = sim.npcs.map(n => V.effTraits.map(t => n.eff[t]).join());
  const startProf = prevProf.slice();
  let win = { moves: { up: 0, down: 0, flip: 0, break: 0 }, social: 0, neg: 0 };
  const series = [];
  while (sim.day < DAYS) {
    sim.stepTick();
    if (sim.dailyMetrics.length) {
      const m = sim.dailyMetrics.pop(); sim.snapshots.length = 0; // keep memory flat
      for (const k in win.moves) win.moves[k] += m.moves[k];
      for (const [e, c] of Object.entries(m.events)) { if (SOCIAL.has(e)) win.social += c; if (NEG.has(e)) win.neg += c; }
      if ((m.day + 1) % EVERY === 0) {
        const prof = sim.npcs.map(n => pos(n).join());
        const eff = sim.npcs.map(n => V.effTraits.map(t => n.eff[t]).join());
        const rel = sim.npcs.map(n => Object.values(n.rel).map(r => r.liking).join());
        const relFlat = rel.join('|').split(/[|,]/);
        let relChanged = 0; if (prevRel) { const pf = prevRel.join('|').split(/[|,]/); relChanged = relFlat.filter((x, i) => x !== pf[i]).length / relFlat.length; }
        const allPos = sim.npcs.flatMap(n => pos(n));
        const sizes = sim.npcs.map(n => Object.values(n.rel).filter(r => r.liking === 'like' || r.liking === 'close').length);
        series.push({
          day: m.day + 1, friendships: m.friendships, feuds: m.feuds, isolates: m.isolates,
          friendsPerVillager: sizes.reduce((a, b) => a + b, 0) / N,
          distinctProfiles: new Set(prof).size, distinctTraitMixes: new Set(eff).size,
          coreShare: allPos.filter(x => Math.abs(x) === 3).length / allPos.length,
          positiveShare: allPos.filter(x => x > 0).length / allPos.length,
          meanPos: V.pairs.map((_, i) => sim.npcs.reduce((s, n) => s + pos(n)[i], 0) / N),
          beliefMovesPerVillagerPer100d: (win.moves.up + win.moves.down + win.moves.flip + win.moves.break) / N * (100 / EVERY),
          breaksPer100d: win.moves.break * (100 / EVERY),
          profileChangedShare: prof.filter((x, i) => x !== prevProf[i]).length / N,
          traitChangedShare: eff.filter((x, i) => x !== prevEff[i]).length / N,
          sameAsStartShare: prof.filter((x, i) => x === startProf[i]).length / N,
          likingChangedShare: relChanged,
          unkindShare: win.neg / Math.max(1, win.social),
        });
        prevProf = prof; prevEff = eff; prevRel = rel; win = { moves: { up: 0, down: 0, flip: 0, break: 0 }, social: 0, neg: 0 };
      }
    }
  }
  out.push({ seed, seconds: (Date.now() - t0) / 1000, series });
  const s = series;
  console.log(`seed ${seed}: ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  for (const r of s.filter(r => [50, 100, 250, 500, 750, 1000].includes(r.day)))
    console.log(`  day ${String(r.day).padStart(4)} friends/v ${r.friendsPerVillager.toFixed(2)} feuds ${r.feuds} isol ${r.isolates} profiles ${r.distinctProfiles} traitMixes ${r.distinctTraitMixes} core ${(r.coreShare * 100).toFixed(0)}% pos ${(r.positiveShare * 100).toFixed(0)}% moves/v/100d ${r.beliefMovesPerVillagerPer100d.toFixed(2)} profChg ${(r.profileChangedShare * 100).toFixed(0)}% sameAsStart ${(r.sameAsStartShare * 100).toFixed(0)}% likingChg ${(r.likingChangedShare * 100).toFixed(1)}% unkind ${(r.unkindShare * 100).toFixed(1)}%`);
}
mkdirSync('reports', { recursive: true });
writeFileSync(`reports/exp9_longrun_${SET}.json`, JSON.stringify({ set: SET, n: N, days: DAYS, every: EVERY, runs: out }, null, 1));
