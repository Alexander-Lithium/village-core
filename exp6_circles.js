// Experiment 6b: cost and social effect of how many people each villager knows.
// Acquaintance circle = hamlet size − 1 (everyone in a hamlet knows everyone else in it).
// Usage: node exp6_circles.js cost <circle>   -> one process per measurement (clean memory)
//        node exp6_circles.js social           -> social outcomes, 1,000 villagers, 10 seeds, 30 days
import { readFileSync } from 'node:fs';
import { TABLES, fileName, createSim } from './engine.js';

const tables = Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`tables/consensus_blind8/${fileName(t)}`, 'utf8')]));
const mode = process.argv[2];

if (mode === 'cost') {
  const circle = +process.argv[3], n = 30000;
  global.gc && global.gc();
  const before = process.memoryUsage().heapUsed;
  const sim = createSim({ runSeed: 101, n, days: 2, hamletSize: circle + 1, logDecisions: false }, tables);
  global.gc && global.gc();
  const mem = process.memoryUsage().heapUsed - before;
  let ms = 0;
  for (let i = 0; i < 16; i++) { const a = performance.now(); sim.stepTick(); ms += performance.now() - a; }
  console.log(JSON.stringify({ circle, n, kbPerVillager: mem / n / 1024, msPerHour: ms / 16, usPerVillagerHour: 1000 * ms / 16 / n }));
} else if (mode === 'social') {
  const out = [];
  for (const circle of [19, 20, 50, 100]) {
    if (circle === 19) continue; // 19 = reference village (hamlets of 20); reported from Experiment 3
    const r = { circle, friendsPerVillager: 0, feudsPerVillager: 0, isolatesPct: 0, unkind: 0 };
    const seeds = 10;
    for (let s = 101; s < 101 + seeds; s++) {
      const n = 1000;
      const sim = createSim({ runSeed: s, n, days: 30, hamletSize: circle + 1, logDecisions: true }, tables).runAll();
      const m = sim.dailyMetrics[sim.dailyMetrics.length - 1];
      let acts = 0, neg = 0;
      for (let i = 1; i < sim.eventLog.length; i++) {
        const f = sim.eventLog[i].split(',');
        if (f[2] === '-' || f[4] === 'apologise') continue;
        acts++; if (['argue', 'interrupt', 'ignore', 'take credit'].includes(f[4])) neg++;
      }
      r.friendsPerVillager += 2 * m.friendships / n / seeds;
      r.feudsPerVillager += 2 * m.feuds / n / seeds;
      r.isolatesPct += 100 * m.isolates / n / seeds;
      r.unkind += 100 * neg / acts / seeds;
    }
    out.push(r);
    process.stderr.write(`circle ${circle} done\n`);
  }
  console.log(JSON.stringify(out));
}
