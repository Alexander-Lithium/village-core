#!/usr/bin/env node
// run.js — command-line batch runner (A13).
import fs from 'node:fs';
import path from 'node:path';
import { Sim, TABLE_SCHEMAS, PAIRS, makeConfig } from './engine.js';

const INT = ['runSeed', 'castSeed', 'n', 'days', 'hamletSize', 'pSecond'];
const BOOL = ['loopOff', 'traitsOff', 'logDecisions', 'skipValidation'];

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) throw new Error(`unexpected argument "${a}"`);
    const k = a.slice(2), nx = argv[i + 1];
    if (BOOL.includes(k)) {
      if (nx === 'true' || nx === 'false') { o[k] = nx === 'true'; i++; } else o[k] = true;
    } else if (k === 'noLog') {
      o.logDecisions = false;
    } else {
      if (nx === undefined) throw new Error(`--${k} needs a value`);
      o[k] = INT.includes(k) ? parseInt(nx, 10) : nx;
      i++;
    }
  }
  return o;
}

const args = parseArgs(process.argv.slice(2));
const outDir = args.out ?? 'results/run'; delete args.out;
const seeds = args.seeds; delete args.seeds;
const cfg = makeConfig(args);

const tableFiles = Object.fromEntries(TABLE_SCHEMAS.map((s) => [s.file, fs.readFileSync(path.join(cfg.tableDir, s.file), 'utf8')]));
const CAST_PATH = 'cast/cast_s1_n20.csv';
const castText = cfg.castSeed === 1 && cfg.n <= 20 && fs.existsSync(CAST_PATH) ? fs.readFileSync(CAST_PATH, 'utf8') : null;

function runOne(c, dir) {
  const sim = new Sim(c, tableFiles, castText);
  while (!sim.done) sim.stepTick();
  fs.mkdirSync(dir, { recursive: true });
  const summary = sim.summary();
  fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  if (c.logDecisions) {
    fs.writeFileSync(path.join(dir, 'decision_log.csv'), sim.decisionLogText());
    fs.writeFileSync(path.join(dir, 'event_log.csv'), sim.eventLogText());
  }
  if (sim.keepSnapshots) {
    fs.writeFileSync(path.join(dir, 'snapshots.json'), JSON.stringify({ initial: sim.initialSnapshot, days: sim.snapshots }) + '\n');
  }
  console.log(`seed ${c.runSeed}: state ${summary.stateHash}  log ${summary.logHash}  missingRows ${summary.missingRows.count}  ${summary.timing.msPerTick} ms/tick  -> ${dir}`);
  return summary;
}

const POS = ['m3', 'm2', 'm1', 'p1', 'p2', 'p3'];
const HEADER = ['runSeed', 'stateHash', 'logHash', 'missingRows', 'friendships', 'feuds', 'isolates', 'mood_low', 'mood_calm', 'mood_good',
  ...PAIRS.flatMap((p) => POS.map((k) => `${p}_${k}`)), 'moves_up', 'moves_down', 'moves_flip', 'moves_break'];

function finalRow(s) {
  const last = s.days[s.days.length - 1];
  const tot = { up: 0, down: 0, flip: 0, break: 0 };
  for (const d of s.days) for (const k in tot) tot[k] += d.moves[k];
  if (!last) return [s.config.runSeed, s.stateHash, s.logHash, s.missingRows.count].join(',');
  return [s.config.runSeed, s.stateHash, s.logHash, s.missingRows.count, last.friendships, last.feuds, last.isolates,
    last.moods.low, last.moods.calm, last.moods.good,
    ...PAIRS.flatMap((p) => POS.map((k) => last.positions[p][k])), tot.up, tot.down, tot.flip, tot.break].join(',');
}

if (seeds) {
  const [a, b] = String(seeds).split('-').map((x) => parseInt(x, 10));
  const hi = Number.isNaN(b) || b === undefined ? a : b;
  const rows = [HEADER.join(',')];
  for (let s = a; s <= hi; s++) rows.push(finalRow(runOne({ ...cfg, runSeed: s }, path.join(outDir, `seed_${s}`))));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'final_metrics.csv'), rows.join('\n') + '\n');
  console.log(`wrote ${path.join(outDir, 'final_metrics.csv')}`);
} else {
  runOne(cfg, outDir);
}
