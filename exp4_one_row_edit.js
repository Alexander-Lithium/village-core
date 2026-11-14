// Experiment 4 (export numbering): readability. (a) Full traces for three decisions. (b) One-row edit with paired seeds.
// Edit: T4 'friendly, field, low honesty' backup act: take credit -> chat
// ("a friendly but dishonest villager no longer takes credit for a friend's work").
import { writeFileSync, mkdirSync } from 'node:fs';
import { createSim, TABLES } from './engine.js';
import { readSet, SEEDS, DAYS } from './exp3_spread_of_lives.js';

const NAMES = Object.fromEntries(TABLES.map(t => [t.id, t.name]));
const base = readSet('consensus_blind8');
const OLD = 'friendly,field,low,help,take credit', NEW = 'friendly,field,low,help,chat';
if (!base.T4.includes(OLD + '\n')) throw new Error('row not found');
const edited = { ...base, T4: base.T4.replace(OLD + '\n', NEW + '\n') };

function measure(tables, seed) {
  const sim = createSim({ runSeed: seed, n: 20, days: DAYS, logDecisions: true }, tables).runAll();
  let targeted = 0, creditTaken = 0, acts = 0, unkind = 0, work = 0, workWell = 0, meals = 0, fieldHours = 0;
  for (let i = 1; i < sim.logLines.length; i++) {
    const f = sim.logLines[i].split(',');
    if (f[2] === 'T4' && f[3] === 'friendly|field|low' && f[5] === 'second') targeted++;
    if (f[2] === 'T2') { const out = f[4].split('|'); const room = f[5] === 'second' ? out[1] : out[0]; if (room === 'field') fieldHours++; }
    if (f[2] === 'T1' && (f[4] === 'eat' || f[4] === 'eat now')) meals++;
  }
  for (let i = 1; i < sim.eventLog.length; i++) {
    const f = sim.eventLog[i].split(',');
    if (f[5] === 'credit taken') creditTaken++;
    if (f[5] === 'work went well' || f[5] === 'work went badly') { work++; if (f[5] === 'work went well') workWell++; continue; }
    if (f[2] === '-' || f[4] === 'apologise') continue;
    acts++; if (['argue', 'interrupt', 'ignore', 'take credit'].includes(f[4])) unkind++;
  }
  const s = sim.summary(), last = s.dailyMetrics[s.dailyMetrics.length - 1];
  let moves = 0; for (const d of s.dailyMetrics) for (const k in d.moves) moves += d.moves[k];
  return { targeted, creditTaken, friendships: last.friendships, feuds: last.feuds, unkindShare: unkind / acts, beliefMoves: moves,
    workDays: work, workWellShare: workWell / Math.max(1, work), hungerSignals: meals, fieldHours, sim };
}

const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1)); };

if (import.meta.url === `file://${process.argv[1]}`) {
  const keys = ['targeted', 'creditTaken', 'friendships', 'feuds', 'unkindShare', 'beliefMoves', 'workDays', 'workWellShare', 'hungerSignals', 'fieldHours'];
  const B = [], E = [];
  let traceSim = null;
  for (const seed of SEEDS) { const b = measure(base, seed); if (seed === SEEDS[0]) traceSim = b.sim; delete b.sim; B.push(b); const e = measure(edited, seed); delete e.sim; E.push(e); }
  const rows = keys.map(k => {
    const d = B.map((b, i) => E[i][k] - b[k]);
    const m = mean(d), ci = 1.96 * sd(d) / Math.sqrt(d.length), noise = sd(B.map(b => b[k]));
    return { metric: k, base: mean(B.map(b => b[k])), edited: mean(E.map(e => e[k])), diff: m, ci, seedNoiseSD: noise, effectInSeedSD: noise ? m / noise : 0 };
  });
  // identical-until-first-use check: how many runs are identical up to the first time the edited row is consulted
  console.log('ONE-ROW EDIT: T4 friendly|field|low  backup act  take credit -> chat   (50 paired seeds, 60 days)');
  console.log('metric'.padEnd(16), 'before'.padEnd(10), 'after'.padEnd(10), 'change (95% CI)'.padEnd(24), 'seed-to-seed SD'.padEnd(16), 'change in SDs');
  const fmt = (k, x) => (k.includes('Share') ? (100 * x).toFixed(1) + '%' : x.toFixed(1));
  for (const r of rows) console.log(r.metric.padEnd(16), fmt(r.metric, r.base).padEnd(10), fmt(r.metric, r.edited).padEnd(10),
    `${fmt(r.metric, r.diff)} ± ${fmt(r.metric, r.ci)}`.padEnd(24), fmt(r.metric, r.seedNoiseSD).padEnd(16), r.effectInSeedSD.toFixed(2));

  // (b) traces: an insult and its consequences, seed 101 consensus
  const sim = traceSim, ev = sim.eventLog, log = sim.logLines;
  const pick = ev.slice(1).map(l => l.split(',')).filter(f => f[6] === 'insult' && f[2] !== '-').slice(0, 3);
  const traces = [];
  for (const f of pick) {
    const [tick, room, I, R, act, event, meaning, pressure, lc] = f;
    const at = log.slice(1).map(l => l.split(',')).filter(x => x[0] === tick && (x[1] === I || x[1] === R));
    const lines = at.map(x => `  ${x[1] === I ? 'actor ' : 'target'} ${x[1]} · ${NAMES[x[2]].padEnd(15)} ${x[3].split('|').join(' + ')}  →  ${x[4].split('|').join(' / ')}${x[5] !== '-' ? ' (' + x[5] + ' choice)' : ''}`);
    traces.push(`Hour ${tick} (day ${Math.floor(+tick / 16) + 1}), ${room}: ${I} → ${act} → ${R} takes it as "${meaning}" (belief pressure: ${pressure}; liking ${lc})\n` + lines.join('\n'));
  }
  console.log('\nDECISION TRACES (seed 101, consensus tables)\n' + traces.join('\n\n'));
  mkdirSync('reports', { recursive: true });
  writeFileSync('reports/exp6.json', JSON.stringify({ edit: { from: OLD, to: NEW }, rows, traces }, null, 1));
}
