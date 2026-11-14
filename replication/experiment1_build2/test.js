// test.js — acceptance tests (A15). Prints PASS/FAIL per test and the golden hashes.
import fs from 'node:fs';
import { sha256 } from './sha256.js';
import { Sim, loadTables, generateCast, TABLE_SCHEMAS } from './engine.js';

const readDir = (dir) => Object.fromEntries(TABLE_SCHEMAS.map((s) => [s.file, fs.readFileSync(`${dir}/${s.file}`, 'utf8')]));
const rules = readDir('tables/rules');
const castFile = fs.readFileSync('cast/cast_s1_n20.csv', 'utf8');
const castFor = (cfg) => ((cfg.castSeed ?? 1) === 1 && cfg.n <= 20 ? castFile : null);
function run(cfg, files = rules) {
  const sim = new Sim(cfg, files, castFor(cfg));
  while (!sim.done) sim.stepTick();
  return sim;
}
function editRows(text, fn) {
  const lines = text.split('\n');
  const out = [lines[0]];
  for (const l of lines.slice(1)) { if (!l) continue; const r = fn(l); if (r !== null) out.push(r); }
  return out.join('\n') + '\n';
}
function assert(c, msg) { if (!c) throw new Error(msg); }

let passed = 0, failed = 0;
function test(name, fn) {
  try { const note = fn(); console.log(`PASS  ${name}${note ? '  — ' + note : ''}`); passed++; }
  catch (e) { console.log(`FAIL  ${name}  — ${e.message}`); failed++; }
}

let golden20 = null, golden5 = null;

test('0. SHA-256 known vectors', () => {
  assert(sha256('') === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'empty string');
  assert(sha256('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', '"abc"');
  assert(sha256('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq') === '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1', '448-bit vector');
});

test('1. Validation', () => {
  const ok = loadTables(rules);
  assert(ok.errors.length === 0, 'rule tables invalid: ' + ok.errors.join('; '));
  const rowsTotal = TABLE_SCHEMAS.reduce((a, s) => a + ok.tables[s.id].rows.size, 0);
  const del = { ...rules, 'T3_stance.csv': editRows(rules['T3_stance.csv'], (l) => (l.startsWith('mid,neutral,calm,') ? null : l)) };
  assert(loadTables(del).errors.some((e) => e.includes('missing row')), 'deleted row not detected');
  const bad = { ...rules, 'T3_stance.csv': editRows(rules['T3_stance.csv'], (l) => (l.startsWith('high,close,good,') ? 'high,close,good,angry' : l)) };
  assert(loadTables(bad).errors.some((e) => e.includes('"angry"')), 'illegal output not detected');
  const badAct = { ...rules, 'T4_act.csv': editRows(rules['T4_act.csv'], (l) => (l.startsWith('friendly,field,mid,') ? 'friendly,field,mid,praise,chat' : l)) };
  assert(loadTables(badAct).errors.some((e) => e.includes('"praise"')), 'act not allowed in room not detected');
  const badP = { ...rules, 'T6_appraise_trust.csv': editRows(rules['T6_appraise_trust.csv'], (l) => (l.startsWith('helped,people mean well,core,') ? 'helped,people mean well,core,good sign,stronger,up' : l)) };
  assert(loadTables(badP).errors.some((e) => e.includes('"stronger"')), 'pressure constraint not detected');
  return `${rowsTotal} rows valid; deleted row, illegal output, wrong-room act, core "stronger" all detected`;
});

test('2. Determinism', () => {
  golden20 = run({ runSeed: 1, n: 20, days: 30 });
  const b = run({ runSeed: 1, n: 20, days: 30 });
  assert(golden20.stateHash === b.stateHash, 'state hash differs');
  assert(golden20.logHash === b.logHash, 'log hash differs');
  return `state ${golden20.stateHash.slice(0, 16)}…`;
});

test('3. Seed sensitivity', () => {
  const c = run({ runSeed: 2, n: 20, days: 30 });
  assert(c.stateHash !== golden20.stateHash, 'runSeed 2 gave the same state hash');
});

test('4. Stream isolation', () => {
  const mod = { ...rules, 'T4_act.csv': editRows(rules['T4_act.csv'], (l) => (l.startsWith('neutral,square,mid,') ? 'neutral,square,mid,argue,interrupt' : l)) };
  const base = run({ runSeed: 1, n: 20, days: 1 });
  const alt = run({ runSeed: 1, n: 20, days: 1 }, mod);
  const meets = (s) => s.events.filter((l) => !l.startsWith('night')).map((l) => l.split(',').slice(0, 4).join(','));
  assert(JSON.stringify(meets(base)) === JSON.stringify(meets(alt)), 'meeting sequence changed');
  const acts = (s) => s.events.map((l) => l.split(',')[4]).join();
  return `${meets(base).length} meetings identical; acts ${acts(base) === acts(alt) ? 'unchanged (row not hit)' : 'changed'}`;
});

test('5. Loop off', () => {
  const s = run({ runSeed: 1, n: 20, days: 30, loopOff: true });
  const pos = (arr) => arr.map((x) => `${x.trust},${x.worth},${x.effort}`).join(';');
  assert(pos(s.initialSnapshot) === pos(s.snapshots[s.snapshots.length - 1].npcs), 'belief positions changed');
});

test('6. Traits off', () => {
  const s = run({ runSeed: 1, n: 20, days: 3, traitsOff: true });
  assert(s.npcs.every((p) => Object.values(p.temperament).every((v) => v === 'mid')), 'a temperament trait is not mid');
});

test('7. Fallback', () => {
  const del = { ...rules, 'T3_stance.csv': editRows(rules['T3_stance.csv'], (l) => (l.startsWith('mid,neutral,calm,') ? null : l)) };
  const s = run({ runSeed: 1, n: 20, days: 30, skipValidation: true }, del);
  assert(s.done, 'run did not complete');
  assert(s.missingCount > 0, 'missingRows is 0');
  assert(s.missingKeys.includes('T3:mid|neutral|calm'), 'deleted key not recorded');
  assert(s.log.some((l) => l.includes(',T3,mid|neutral|calm,neutral,-')), 'default output not logged');
  return `missingRows ${s.missingCount}`;
});

test('8. Body sanity', () => {
  assert(golden20.maxStarvingStreak <= 16, `max starving streak ${golden20.maxStarvingStreak}`);
  return `max consecutive starving ticks ${golden20.maxStarvingStreak}`;
});

test('9. Cast', () => {
  const h = sha256(generateCast(1, 20));
  assert(h === sha256(castFile), 'regenerated cast differs from shipped file');
  return h;
});

test('10. Scale', () => {
  const s = run({ runSeed: 1, n: 10000, days: 1, logDecisions: false });
  assert(s.done, 'did not complete');
  return `n 10000: ${(s.elapsedMs / s.wakingTicks).toFixed(2)} ms per tick (setup ${s.setupMs.toFixed(0)} ms)`;
});

test('11. Golden hashes', () => {
  golden5 = run({ runSeed: 1, n: 5, days: 3 });
});

console.log(`\n${passed} passed, ${failed} failed\n`);
console.log('Golden hashes (rule tables, castSeed 1):');
if (golden20) console.log(`  runSeed 1, n 20, days 30   state ${golden20.stateHash}\n                             log   ${golden20.logHash}`);
if (golden5) console.log(`  runSeed 1, n 5,  days 3    state ${golden5.stateHash}\n                             log   ${golden5.logHash}`);
process.exitCode = failed ? 1 : 0;
