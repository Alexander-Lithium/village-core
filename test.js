// Acceptance tests (spec A15). Run: node test.js
import { readFileSync } from 'node:fs';
import { createSim, TABLES, loadTable, castCsv, generateCast, fileName, TABLE_BY_ID } from './engine.js';
import { sha256 } from './sha256.js';
import { ruleTableTexts } from './gen_rule_tables.js';

const DIR = 'tables/rules';
const base = Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`${DIR}/${fileName(t)}`, 'utf8')]));
let pass = 0, fail = 0;
function check(name, cond, info = '') {
  if (cond) { pass++; console.log(`PASS  ${name}${info ? '  ' + info : ''}`); }
  else { fail++; console.log(`FAIL  ${name}${info ? '  ' + info : ''}`); }
}
const run = (cfg, tables = base) => createSim(cfg, tables).runAll();
const dropLine = (text, pred) => text.split('\n').filter((l, i) => i === 0 || !pred(l)).join('\n');

// 1. Validation
{
  let ok = true;
  for (const t of TABLES) { try { loadTable(t, base[t.id]); } catch { ok = false; } }
  const regen = ruleTableTexts();
  const sameAsShipped = TABLES.every(t => regen[t.id] === base[t.id]);
  let caughtMissing = false, caughtIllegal = false;
  const lines = base.T3.split('\n');
  try { loadTable(TABLE_BY_ID.T3, [lines[0], ...lines.slice(2)].join('\n')); } catch { caughtMissing = true; }
  try { loadTable(TABLE_BY_ID.T3, base.T3.replace(/,friendly\n/, ',ecstatic\n')); } catch { caughtIllegal = true; }
  let caughtConstraint = false;
  try { loadTable(TABLE_BY_ID.T6, base.T6.replace(/(core,[^,]+,)same,/, '$1stronger,')); } catch { caughtConstraint = true; }
  check('1 validation', ok && sameAsShipped && caughtMissing && caughtIllegal && caughtConstraint,
    `rules valid=${ok} regen==shipped=${sameAsShipped} missing=${caughtMissing} illegal=${caughtIllegal} core-constraint=${caughtConstraint}`);
}

// 2. Determinism
const g20a = run({ runSeed: 1, n: 20, days: 30 }).summary();
const g20b = run({ runSeed: 1, n: 20, days: 30 }).summary();
check('2 determinism', g20a.stateHash === g20b.stateHash && g20a.logHash === g20b.logHash);

// 3. Seed sensitivity
const s2 = run({ runSeed: 2, n: 20, days: 30 }).summary();
check('3 seed sensitivity', s2.stateHash !== g20a.stateHash);

// 4. Stream isolation: change one T4 row; day-1 meetings unchanged
{
  const altered = base.T4.replace('neutral,field,mid,chat,help', 'neutral,field,mid,argue,take credit');
  const meet = sim => sim.eventLog.filter(l => { const t = parseInt(l.split(',')[0], 10); return t < 16 && l.split(',')[2] !== '-'; })
    .map(l => l.split(',').slice(0, 4).join(','));
  const a = createSim({ runSeed: 1, n: 20, days: 1 }, base).runAll();
  const b = createSim({ runSeed: 1, n: 20, days: 1 }, { ...base, T4: altered }).runAll();
  const ma = meet(a), mb = meet(b);
  const actsDiffer = a.eventLog.join() !== b.eventLog.join();
  check('4 stream isolation', altered !== base.T4 && ma.join('\n') === mb.join('\n'), `meetings=${ma.length} actsDiffer=${actsDiffer}`);
}

// 5. Loop off
{
  const sim = run({ runSeed: 1, n: 20, days: 30, loopOff: true });
  const first = JSON.stringify(sim.snapshots[0].npcs.map(n => n.pos));
  const last = JSON.stringify(sim.snapshots[sim.snapshots.length - 1].npcs.map(n => n.pos));
  const cast = generateCast(1, 20).map(c => Object.fromEntries(Object.entries(c.beliefs).map(([p, b]) => [p, (b.pole === 0 ? 1 : -1) * (b.tier + 1)])));
  check('5 loop off', first === last && last === JSON.stringify(cast));
}

// 6. Traits off
{
  const sim = createSim({ runSeed: 1, n: 20, days: 1, traitsOff: true }, base);
  check('6 traits off', sim.npcs.every(n => Object.values(n.temperament).every(v => v === 'mid')));
}

// 7. Fallback
{
  const t3 = dropLine(base.T3, l => l.startsWith('mid,neutral,calm,'));
  const sim = createSim({ runSeed: 1, n: 20, days: 2, skipValidation: true }, { ...base, T3: t3 }).runAll();
  const s = sim.summary();
  const usedDefault = sim.logLines.some(l => l.includes(',T3,mid|neutral|calm,neutral,'));
  check('7 fallback', s.missingRows > 0 && usedDefault, `missingRows=${s.missingRows}`);
}

// 8. Body sanity
{
  const sim = createSim({ runSeed: 1, n: 20, days: 30, logDecisions: false }, base);
  const streak = {}; let worst = 0;
  while (sim.stepTick() || sim.day < 30) {
    for (const n of sim.npcs) { streak[n.id] = n.food <= 15 ? (streak[n.id] || 0) + 1 : 0; worst = Math.max(worst, streak[n.id]); }
    if (sim.day >= 30) break;
  }
  check('8 body sanity', worst <= 16, `longest starving streak=${worst} ticks`);
}

// 9. Cast file
{
  const shipped = readFileSync('cast/cast_s1_n20.csv', 'utf8');
  check('9 cast', sha256(shipped) === sha256(castCsv(generateCast(1, 20))));
}

// 10. Scale
{
  const sim = run({ runSeed: 1, n: 10000, days: 1, logDecisions: false });
  const s = sim.summary();
  check('10 scale', s.stateHash.length === 64, `n=10000 ms/tick=${s.timing.msPerTick.toFixed(2)}`);
}

// 11. Golden hashes
const g5 = run({ runSeed: 1, n: 5, days: 3 }).summary();
console.log('\nGOLDEN  runSeed 1, n 20, days 30, rule tables');
console.log('  stateHash', g20a.stateHash);
console.log('  logHash  ', g20a.logHash);
console.log('GOLDEN  runSeed 1, n 5, days 3, rule tables');
console.log('  stateHash', g5.stateHash);
console.log('  logHash  ', g5.logHash);
console.log('Cast hash', g20a.castHash);
console.log('Table hashes', JSON.stringify(g20a.tableHashes));
check('11 golden printed', true);
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
