// Command-line batch runner (spec A13).
// node run.js --runSeed 1 --n 20 --days 30 --tableDir tables/rules [--loopOff] [--traitsOff]
//             [--tablesMode shuffled|random] [--seeds 1-100] [--noLog] --out results/<name>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createSim, TABLES, fileName, V } from './engine.js';

export function readTables(dir) {
  return Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`${dir}/${fileName(t)}`, 'utf8')]));
}

export function finalMetricsRow(sim, s) {
  const last = s.dailyMetrics[s.dailyMetrics.length - 1];
  const totals = {};
  for (const m of s.dailyMetrics) for (const [k, v] of Object.entries(m.moves)) totals[k] = (totals[k] || 0) + v;
  const pos = n => V.pairs.map(p => { const b = n.beliefs[p]; return (b.pole === 0 ? 1 : -1) * (b.tier + 1); }).join(' ');
  const profiles = new Set(sim.npcs.map(pos)).size;
  return {
    runSeed: s.config.runSeed, stateHash: s.stateHash,
    friendships: last.friendships, feuds: last.feuds, isolates: last.isolates,
    distinctBeliefProfiles: profiles,
    ups: totals.up || 0, downs: totals.down || 0, flips: totals.flip || 0, breaks: totals.break || 0,
    missingRows: s.missingRows, msPerTick: s.timing.msPerTick,
  };
}

function parseArgs(argv) {
  const a = {};
  for (let k = 0; k < argv.length; k++) {
    const x = argv[k];
    if (!x.startsWith('--')) continue;
    const key = x.slice(2);
    const nxt = argv[k + 1];
    if (nxt === undefined || nxt.startsWith('--')) a[key] = true; else { a[key] = nxt; k++; }
  }
  return a;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = parseArgs(process.argv.slice(2));
  const cfg = {
    runSeed: parseInt(a.runSeed || '1', 10), castSeed: parseInt(a.castSeed || '1', 10),
    n: parseInt(a.n || '20', 10), days: parseInt(a.days || '30', 10),
    hamletSize: parseInt(a.hamletSize || '20', 10), pSecond: parseInt(a.pSecond || '25', 10),
    tableDir: a.tableDir || 'tables/rules', loopOff: !!a.loopOff, traitsOff: !!a.traitsOff,
    tablesMode: a.tablesMode || 'csv', logDecisions: !a.noLog,
  };
  const out = a.out || 'results/run';
  mkdirSync(out, { recursive: true });
  const tables = readTables(cfg.tableDir);
  let seeds = [cfg.runSeed];
  if (a.seeds) { const [lo, hi] = String(a.seeds).split('-').map(Number); seeds = []; for (let s = lo; s <= (hi || lo); s++) seeds.push(s); }
  const rows = [];
  for (const seed of seeds) {
    const sim = createSim({ ...cfg, runSeed: seed }, tables).runAll();
    const s = sim.summary();
    writeFileSync(`${out}/summary_seed${seed}.json`, JSON.stringify(s, null, 1));
    if (seeds.length === 1 && cfg.logDecisions) {
      writeFileSync(`${out}/decisions_seed${seed}.csv`, sim.decisionLogText());
      writeFileSync(`${out}/events_seed${seed}.csv`, sim.eventLogText());
    }
    rows.push(finalMetricsRow(sim, s));
  }
  const cols = Object.keys(rows[0]);
  writeFileSync(`${out}/final_metrics.csv`, [cols.join(','), ...rows.map(r => cols.map(c => r[c]).join(','))].join('\n') + '\n');
  console.log(`Ran ${seeds.length} seed(s) -> ${out}`);
  if (seeds.length === 1) console.log(JSON.stringify(rows[0], null, 1));
}
