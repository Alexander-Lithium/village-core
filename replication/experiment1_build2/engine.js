// engine.js — Village Core v1.0
// Deterministic agent-based village simulation. One ES module, no dependencies.
// Runs unchanged in Node >= 18 and modern browsers. Tables are data (CSV); none are hard-coded here.
import { sha256, utf8Bytes } from './sha256.js';

export const VERSION = 'village-core-1.0';

// ---------------------------------------------------------------- A3 vocabulary
export const LEVELS = ['low', 'mid', 'high'];
export const TRAITS = ['warmth', 'sociability', 'diligence', 'honesty', 'pride', 'flexibility'];
export const EFF_TRAITS = ['warmth', 'sociability', 'diligence', 'pride'];
export const FOOD_TIERS = ['starving', 'very hungry', 'hungry', 'fed'];
export const ENERGY_TIERS = ['exhausted', 'very tired', 'tired', 'rested'];
export const MOODS = ['low', 'calm', 'good'];
export const LIKINGS = ['dislike', 'neutral', 'like', 'close'];
export const PAIRS = ['trust', 'worth', 'effort'];
export const POLES = {
  trust: { pos: 'people mean well', neg: 'people are against me' },
  worth: { pos: 'i am respected', neg: 'i am overlooked' },
  effort: { pos: 'hard work pays off', neg: 'nothing i do matters' },
};
export const BELIEFS = PAIRS.flatMap((p) => [POLES[p].pos, POLES[p].neg]);
export const TIERS = ['faint', 'held', 'core'];
export const ROOMS = ['home', 'field', 'square'];
export const NEEDS = ['none', 'eat', 'rest', 'eat now', 'rest now'];
export const STANCES = ['friendly', 'neutral', 'cold', 'hostile'];
export const ACTS_BY_ROOM = {
  field: ['help', 'chat', 'take credit', 'argue'],
  square: ['chat', 'praise', 'share food', 'interrupt', 'ignore', 'argue'],
};
export const ALL_ACTS = ['help', 'chat', 'take credit', 'argue', 'praise', 'share food', 'interrupt', 'ignore'];
export const NEGATIVE_ACTS = ['argue', 'interrupt', 'ignore', 'take credit'];
// [act, event, pair, valence] in A3 events-table order
export const EVENT_TABLE = [
  ['help', 'helped', 'trust', 1],
  ['chat', 'chatted with', 'trust', 1],
  ['share food', 'shared food with', 'trust', 1],
  ['argue', 'argued with', 'trust', -1],
  ['interrupt', 'interrupted', 'trust', -1],
  [null, 'apologised to', 'trust', 1],
  ['praise', 'praised', 'worth', 1],
  ['ignore', 'ignored', 'worth', -1],
  ['take credit', 'credit taken', 'worth', -1],
  [null, 'work went well', 'effort', 1],
  [null, 'work went badly', 'effort', -1],
];
export const EVENT_INFO = {};
export const ACT_EVENT = {};
export const EVENTS = { trust: [], worth: [], effort: [] };
for (const [act, ev, pair, valence] of EVENT_TABLE) {
  EVENT_INFO[ev] = { pair, valence };
  EVENTS[pair].push(ev);
  if (act) ACT_EVENT[act] = ev;
}
export const ALL_EVENTS = EVENT_TABLE.map((e) => e[1]);
export const MEANINGS = ['good sign', 'nothing much', 'slight', 'insult'];
export const PRESSURES = ['stronger', 'same', 'weaker', 'strained'];
export const LIKING_CHANGES = ['up', 'same', 'down'];
export const GRUDGE_RESPONSES = ['let it go', 'cool off', 'hold grudge', 'pay back'];
export const APOLOGY_DECISIONS = ['apologise', "don't"];
export const BALANCES = ['mostly against', 'mixed', 'mostly for', 'strongly for'];
export const MOVES = ['stay', 'up', 'down', 'flip', 'break'];
export const STEPS = ['-1', '0', '+1'];

// ---------------------------------------------------------------- A5/A6 table schemas
const col = (name, values) => ({ name, values });
export const TABLE_SCHEMAS = [
  { id: 'T1', file: 'T1_needs.csv', type: 'designer',
    inputs: [col('food', FOOD_TIERS), col('energy', ENERGY_TIERS)],
    outputs: [col('need', NEEDS)], def: () => ['none'] },
  { id: 'T2', file: 'T2_action.csv', type: 'teacher',
    inputs: [col('need', ['none', 'eat', 'rest']), col('diligence', LEVELS), col('sociability', LEVELS)],
    outputs: [col('first', ROOMS), col('second', ROOMS)], def: () => ['home', 'square'] },
  { id: 'T3', file: 'T3_stance.csv', type: 'teacher',
    inputs: [col('warmth', LEVELS), col('liking', LIKINGS), col('mood', MOODS)],
    outputs: [col('stance', STANCES)], def: () => ['neutral'] },
  { id: 'T4', file: 'T4_act.csv', type: 'teacher', groupCol: 1,
    inputs: [col('stance', STANCES), col('room', ['field', 'square']), col('honesty', LEVELS)],
    outputs: [col('first', ALL_ACTS), col('second', ALL_ACTS)], def: () => ['chat', 'chat'] },
  { id: 'T5', file: 'T5_apology.csv', type: 'teacher',
    inputs: [col('honesty', LEVELS), col('pride', LEVELS)],
    outputs: [col('decision', APOLOGY_DECISIONS)], def: () => ["don't"] },
  { id: 'T6', file: 'T6_appraise_trust.csv', type: 'teacher', groupCol: 2,
    inputs: [col('event', EVENTS.trust), col('belief', [POLES.trust.pos, POLES.trust.neg]), col('tier', TIERS)],
    outputs: [col('meaning', MEANINGS), col('pressure', PRESSURES), col('liking_change', LIKING_CHANGES)],
    def: () => ['nothing much', 'same', 'same'] },
  { id: 'T7', file: 'T7_appraise_worth.csv', type: 'teacher', groupCol: 2,
    inputs: [col('event', EVENTS.worth), col('belief', [POLES.worth.pos, POLES.worth.neg]), col('tier', TIERS), col('pride', LEVELS)],
    outputs: [col('meaning', MEANINGS), col('pressure', PRESSURES), col('liking_change', LIKING_CHANGES)],
    def: () => ['nothing much', 'same', 'same'] },
  { id: 'T8', file: 'T8_appraise_effort.csv', type: 'teacher', groupCol: 2,
    inputs: [col('event', EVENTS.effort), col('belief', [POLES.effort.pos, POLES.effort.neg]), col('tier', TIERS)],
    outputs: [col('meaning', MEANINGS), col('pressure', PRESSURES)], def: () => ['nothing much', 'same'] },
  { id: 'T9', file: 'T9_mood.csv', type: 'teacher',
    inputs: [col('mood', MOODS), col('meaning', MEANINGS)],
    outputs: [col('new_mood', MOODS)], def: (inp) => [inp[0]] },
  { id: 'T10', file: 'T10_grudge.csv', type: 'teacher',
    inputs: [col('warmth', LEVELS), col('offence', ['slight', 'insult']), col('apology', ['none', 'received'])],
    outputs: [col('response', GRUDGE_RESPONSES)], def: () => ['cool off'] },
  { id: 'T11', file: 'T11_integration.csv', type: 'designer',
    inputs: [col('balance', BALANCES), col('tier', TIERS), col('flexibility', LEVELS)],
    outputs: [col('move', MOVES)], def: () => ['stay'] },
  { id: 'T12', file: 'T12_compile.csv', type: 'teacher',
    inputs: [col('belief', BELIEFS), col('tier', TIERS)],
    outputs: [col('warmth', STEPS), col('sociability', STEPS), col('diligence', STEPS), col('pride', STEPS)],
    def: () => ['0', '0', '0', '0'] },
];
export const SCHEMA = Object.fromEntries(TABLE_SCHEMAS.map((s) => [s.id, s]));

export function tableHeader(schema) {
  return [...schema.inputs, ...schema.outputs].map((c) => c.name).join(',');
}

// Allowed values for output column ci of a row with the given inputs (A6.0 constraints).
export function allowedValues(schema, ci, inputs) {
  if (schema.id === 'T4') return ACTS_BY_ROOM[inputs[1]] || [];
  if (schema.outputs[ci].name === 'pressure') {
    return inputs[2] === 'core' ? ['same', 'strained'] : ['stronger', 'same', 'weaker'];
  }
  return schema.outputs[ci].values;
}

// Full grid of input combinations, first column outermost, values in A3 order.
export function grid(schema) {
  let out = [[]];
  for (const c of schema.inputs) {
    const next = [];
    for (const p of out) for (const v of c.values) next.push([...p, v]);
    out = next;
  }
  return out;
}

export function splitLines(text) {
  return text.replace(/^\uFEFF/, '').split('\n')
    .map((l) => (l.endsWith('\r') ? l.slice(0, -1) : l))
    .filter((l) => l.length > 0);
}

// Normalised table text (A6.0): header, rows sorted by key (UTF-16 order), every line + '\n'.
export function normalisedTableText(schema, rows) {
  const keys = [...rows.keys()].sort();
  let s = tableHeader(schema) + '\n';
  for (const k of keys) s += k.split('|').concat(rows.get(k)).join(',') + '\n';
  return s;
}

export function parseTable(schema, text) {
  const errors = [];
  const rows = new Map();
  const lines = splitLines(text);
  const expected = tableHeader(schema);
  if (lines.length === 0) return { rows, errors: [`${schema.id}: empty file`] };
  if (lines[0] !== expected) errors.push(`${schema.id}: header "${lines[0]}" should be "${expected}"`);
  const ni = schema.inputs.length, no = schema.outputs.length;
  for (let li = 1; li < lines.length; li++) {
    const line = lines[li];
    const v = line.split(',');
    if (v.length !== ni + no) { errors.push(`${schema.id}: row "${line}" has ${v.length} fields, expected ${ni + no}`); continue; }
    const inp = v.slice(0, ni), out = v.slice(ni);
    let ok = true;
    inp.forEach((x, k) => {
      if (!schema.inputs[k].values.includes(x)) { errors.push(`${schema.id}: extra row "${line}": ${schema.inputs[k].name} value "${x}" is not a valid input`); ok = false; }
    });
    if (!ok) continue;
    const key = inp.join('|');
    if (rows.has(key)) { errors.push(`${schema.id}: duplicate row ${key}`); continue; }
    out.forEach((x, k) => {
      const allowed = allowedValues(schema, k, inp);
      if (!allowed.includes(x)) errors.push(`${schema.id}: row "${line}": ${schema.outputs[k].name} value "${x}" not allowed here`);
    });
    rows.set(key, out);
  }
  for (const combo of grid(schema)) {
    const key = combo.join('|');
    if (!rows.has(key)) errors.push(`${schema.id}: missing row ${key}`);
  }
  return { rows, errors };
}

// files: { 'T1_needs.csv': text, ... }. Never throws; returns { tables, errors }.
export function loadTables(files) {
  const tables = {};
  const errors = [];
  for (const s of TABLE_SCHEMAS) {
    const text = files[s.file];
    if (text == null) { errors.push(`${s.id}: file ${s.file} missing`); tables[s.id] = { schema: s, rows: new Map() }; continue; }
    const r = parseTable(s, text);
    errors.push(...r.errors);
    tables[s.id] = { schema: s, rows: r.rows };
  }
  for (const s of TABLE_SCHEMAS) tables[s.id].hash = sha256(normalisedTableText(s, tables[s.id].rows));
  return { tables, errors };
}

// ---------------------------------------------------------------- A8 randomness
export function fnv1a32(str) {
  const bytes = utf8Bytes(str);
  let h = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) { h ^= bytes[i]; h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
export function mulberry32(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t ^ (t >>> 14)) >>> 0;
  };
  return { next, draw: (n) => next() % n };
}
export function makeStream(seedString) { return mulberry32(fnv1a32(seedString)); }
export function fisherYates(arr, rng) {
  for (let i = arr.length - 1; i >= 1; i--) {
    const j = rng.draw(i + 1);
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

// ---------------------------------------------------------------- A9 cast
export const CAST_HEADER = 'id,warmth,sociability,diligence,honesty,pride,flexibility,trust_pole,trust_tier,worth_pole,worth_tier,effort_pole,effort_tier';
export function npcId(k, n) { return 'n' + String(k).padStart(Math.max(4, String(n).length), '0'); }
export function generateCast(castSeed, n) {
  const rng = makeStream(`cast:${castSeed}`);
  let s = CAST_HEADER + '\n';
  for (let k = 1; k <= n; k++) {
    const v = [npcId(k, n)];
    for (let t = 0; t < TRAITS.length; t++) v.push(LEVELS[rng.draw(3)]);
    for (const p of PAIRS) {
      const pole = rng.draw(2) === 0 ? POLES[p].pos : POLES[p].neg;
      const r = rng.draw(100);
      v.push(pole, r < 50 ? 'faint' : r < 85 ? 'held' : 'core');
    }
    s += v.join(',') + '\n';
  }
  return s;
}
export function parseCast(text) {
  const lines = splitLines(text);
  if (lines[0] !== CAST_HEADER) throw new Error('cast: bad header');
  let prev = '';
  return lines.slice(1).map((line) => {
    const v = line.split(',');
    if (v.length !== 13) throw new Error(`cast: bad row "${line}"`);
    if (v[0] <= prev) throw new Error(`cast: ids not ascending at ${v[0]}`);
    prev = v[0];
    const temperament = {};
    TRAITS.forEach((t, i) => {
      if (!LEVELS.includes(v[1 + i])) throw new Error(`cast: bad ${t} in "${line}"`);
      temperament[t] = v[1 + i];
    });
    const beliefs = {};
    PAIRS.forEach((p, i) => {
      const txt = v[7 + 2 * i], tier = v[8 + 2 * i];
      const pole = txt === POLES[p].pos ? 'pos' : txt === POLES[p].neg ? 'neg' : null;
      if (!pole || !TIERS.includes(tier)) throw new Error(`cast: bad ${p} belief in "${line}"`);
      beliefs[p] = { pole, tier };
    });
    return { id: v[0], temperament, beliefs };
  });
}

// ---------------------------------------------------------------- A13 tablesMode
export function applyTablesMode(tables, mode, streams) {
  if (mode === 'csv') return;
  const teacher = TABLE_SCHEMAS.filter((s) => s.type === 'teacher');
  if (mode === 'shuffled') {
    for (const s of teacher) {
      const t = tables[s.id];
      const keys = [...t.rows.keys()].sort();
      const groups = new Map();
      for (const k of keys) {
        const g = s.groupCol == null ? '' : k.split('|')[s.groupCol];
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g).push(k);
      }
      for (const ks of groups.values()) {
        const outs = ks.map((k) => t.rows.get(k));
        fisherYates(outs, streams.shuffle);
        ks.forEach((k, i) => t.rows.set(k, outs[i]));
      }
    }
  } else if (mode === 'random') {
    for (const s of teacher) {
      const t = tables[s.id];
      for (const k of [...t.rows.keys()].sort()) {
        const inp = k.split('|');
        const out = s.outputs.map((c, ci) => {
          const allowed = allowedValues(s, ci, inp);
          return allowed[streams.random.draw(allowed.length)];
        });
        t.rows.set(k, out);
      }
    }
  } else {
    throw new Error(`unknown tablesMode "${mode}"`);
  }
}

// ---------------------------------------------------------------- helpers
export const DEFAULT_CONFIG = Object.freeze({
  runSeed: 1, castSeed: 1, n: 20, days: 30, hamletSize: 20, pSecond: 25,
  tableDir: 'tables/rules', loopOff: false, traitsOff: false, tablesMode: 'csv',
  logDecisions: true, skipValidation: false,
});
export function makeConfig(c = {}) { return { ...DEFAULT_CONFIG, ...c }; }

const clockMs = () => (globalThis.performance && globalThis.performance.now ? globalThis.performance.now() : Date.now()); // timing only
const li = (lvl) => LEVELS.indexOf(lvl) - 1;
const foodTier = (f) => (f <= 15 ? 'starving' : f <= 35 ? 'very hungry' : f <= 60 ? 'hungry' : 'fed');
const energyTier = (e) => (e <= 15 ? 'exhausted' : e <= 35 ? 'very tired' : e <= 60 ? 'tired' : 'rested');
const towardCalm = () => 'calm'; // low -> calm and good -> calm are both one step
const zeroEvents = () => Object.fromEntries(ALL_EVENTS.map((e) => [e, 0]));
const POS_KEYS = { '-3': 'm3', '-2': 'm2', '-1': 'm1', '1': 'p1', '2': 'p2', '3': 'p3' };
export const beliefPosition = (b) => (b.pole === 'pos' ? 1 : -1) * (TIERS.indexOf(b.tier) + 1);

// A7 belief moves. Returns true if the belief changed.
export function applyMove(b, move) {
  if (move === 'up') {
    if (b.tier === 'faint') { b.tier = 'held'; return true; }
    if (b.tier === 'held') { b.tier = 'core'; return true; }
  } else if (move === 'down') {
    if (b.tier === 'core') { b.tier = 'held'; return true; }
    if (b.tier === 'held') { b.tier = 'faint'; return true; }
  } else if (move === 'flip') {
    if (b.tier === 'faint') { b.pole = b.pole === 'pos' ? 'neg' : 'pos'; return true; }
  } else if (move === 'break') {
    if (b.tier === 'core') { b.pole = b.pole === 'pos' ? 'neg' : 'pos'; b.tier = 'faint'; return true; }
  }
  return false;
}

// ---------------------------------------------------------------- simulation
export class Sim {
  constructor(config, tableFiles, castText = null) {
    const t0 = clockMs();
    const cfg = (this.config = makeConfig(config));
    if (!(cfg.hamletSize >= 1)) throw new Error('hamletSize must be >= 1');
    const { tables, errors } = loadTables(tableFiles);
    if (errors.length && !cfg.skipValidation) throw new Error('Table validation failed:\n' + errors.join('\n'));
    this.validationErrors = errors;
    this.tables = tables;
    this.streams = {};
    for (const s of ['meet', 'room', 'act', 'work', 'shuffle', 'random']) this.streams[s] = makeStream(`${cfg.runSeed}:${s}`);
    applyTablesMode(this.tables, cfg.tablesMode, this.streams);
    this.tableHashes = {};
    for (const s of TABLE_SCHEMAS) {
      const t = this.tables[s.id];
      t.hash = sha256(normalisedTableText(s, t.rows));
      this.tableHashes[s.id] = t.hash;
    }

    // cast
    let castCsv;
    if (castText != null) {
      const lines = splitLines(castText);
      if (lines.length - 1 < cfg.n) throw new Error(`cast has ${lines.length - 1} rows, need ${cfg.n}`);
      castCsv = lines.slice(0, cfg.n + 1).map((l) => l + '\n').join('');
    } else {
      castCsv = generateCast(cfg.castSeed, cfg.n);
    }
    this.castCsv = castCsv;
    this.castHash = sha256(castCsv);
    const cast = parseCast(castCsv);
    this.npcs = cast.map((c, idx) => ({
      id: c.id, idx, hamlet: Math.floor(idx / cfg.hamletSize),
      temperament: cfg.traitsOff ? Object.fromEntries(TRAITS.map((t) => [t, 'mid'])) : c.temperament,
      beliefs: c.beliefs, effective: {},
      food: 80, energy: 80, mood: 'calm', room: 'home', need: 'none',
      fieldTicksToday: 0,
      todayPressure: { trust: [], worth: [], effort: [] },
      buffer: { trust: [], worth: [], effort: [] },
      gotEvent: false, rel: new Map(), starveStreak: 0,
    }));
    this.hamlets = [];
    for (const p of this.npcs) (this.hamlets[p.hamlet] ||= []).push(p);
    for (const h of this.hamlets) {
      for (const a of h) for (const b of h) {
        if (a !== b) a.rel.set(b.idx, { liking: 'neutral', counter: 0, grudge: 'none', offence: 'none', owesApology: false, workedBesideToday: false });
      }
    }

    // run state
    this.day = 0; this.hour = 0; this.done = false;
    this.log = []; this.events = [];
    this.missingCount = 0; this.missingKeys = []; this.missingSet = new Set();
    this.metrics = []; this.snapshots = [];
    this.keepSnapshots = cfg.logDecisions || cfg.n <= 200;
    this.dayEvents = zeroEvents();
    this.maxStarvingStreak = 0; this.wakingTicks = 0; this.elapsedMs = 0;

    for (const p of this.npcs) this.compile(p, 'start'); // initial compile (A12)
    this.initialSnapshot = this.snapshotNpcs(this.npcs.map((p) => p.mood));
    this.setupMs = clockMs() - t0;
    if (cfg.days <= 0) this.finish();
  }

  eff(p, t) { return t === 'honesty' || t === 'flexibility' ? p.temperament[t] : p.effective[t]; }

  // A5 lookup: exact key or default (recorded in missingRows); optional two-option draw; logged.
  lookup(tid, inputs, npc, label, stream = null) {
    const t = this.tables[tid];
    const key = inputs.join('|');
    let out = t.rows.get(key);
    if (out === undefined) {
      out = t.schema.def(inputs);
      this.missingCount++;
      const mk = tid + ':' + key;
      if (!this.missingSet.has(mk)) { this.missingSet.add(mk); this.missingKeys.push(mk); }
    }
    let choice = '-', value = out[0];
    if (stream) {
      if (stream.draw(100) < this.config.pSecond) { choice = 'second'; value = out[1]; } else choice = 'first';
    }
    if (this.config.logDecisions) this.log.push(`${label},${npc.id},${tid},${key},${out.join('|')},${choice}\n`);
    return { out, choice, value };
  }

  // A4 effective traits via T12.
  compile(p, label) {
    const idx = {};
    for (const t of EFF_TRAITS) idx[t] = li(p.temperament[t]);
    for (const pair of PAIRS) {
      const b = p.beliefs[pair];
      const out = this.lookup('T12', [POLES[pair][b.pole], b.tier], p, label).out;
      for (let k = 0; k < 4; k++) idx[EFF_TRAITS[k]] += parseInt(out[k], 10);
    }
    for (const t of EFF_TRAITS) p.effective[t] = LEVELS[Math.max(-1, Math.min(1, idx[t])) + 1];
  }

  // A10: one waking tick (runs the night automatically after hour 15).
  stepTick() {
    if (this.done) return false;
    const t0 = clockMs();
    const npcs = this.npcs;
    const L = String(this.day * 16 + this.hour);

    for (const p of npcs) p.gotEvent = false; // 0
    for (const p of npcs) { // 1 body
      p.food = Math.max(0, p.food - 5);
      p.energy = Math.max(0, p.energy - (p.room === 'field' ? 6 : 4));
    }
    for (const p of npcs) { // 2 needs
      const ft = foodTier(p.food);
      if (ft === 'starving') { p.starveStreak++; if (p.starveStreak > this.maxStarvingStreak) this.maxStarvingStreak = p.starveStreak; } else p.starveStreak = 0;
      p.need = this.lookup('T1', [ft, energyTier(p.energy)], p, L).out[0];
    }
    for (const p of npcs) { // 3 room choice
      if (p.need === 'eat now' || p.need === 'rest now') p.room = 'home';
      else p.room = this.lookup('T2', [p.need, p.effective.diligence, p.effective.sociability], p, L, this.streams.room).value;
    }
    for (const p of npcs) { // 4 home effects
      if (p.room !== 'home') continue;
      if (p.need === 'eat' || p.need === 'eat now') p.food = Math.min(100, p.food + 40);
      else if (p.need === 'rest' || p.need === 'rest now') p.energy = Math.min(100, p.energy + 15);
      else if (p.need === 'none') p.energy = Math.min(100, p.energy + 5);
    }
    for (const p of npcs) if (p.room === 'field') p.fieldTicksToday++; // 5
    for (const h of this.hamlets) { // 6 encounters
      const occ = { field: [], square: [] };
      for (const p of h) if (p.room === 'field' || p.room === 'square') occ[p.room].push(p);
      for (const room of ['field', 'square']) {
        const list = fisherYates(occ[room], this.streams.meet);
        for (let k = 0; k + 1 < list.length; k += 2) {
          const firstInit = this.streams.meet.draw(2) === 0;
          const I = firstInit ? list[k] : list[k + 1];
          const R = firstInit ? list[k + 1] : list[k];
          this.encounter(I, R, room, L);
        }
      }
    }
    for (const p of npcs) if (!p.gotEvent) p.mood = towardCalm(p.mood); // 8

    this.wakingTicks++;
    this.hour++;
    let finished = false;
    if (this.hour === 16) {
      this.night();
      this.hour = 0;
      this.day++;
      if (this.day >= this.config.days) finished = true;
    }
    this.elapsedMs += clockMs() - t0;
    if (finished) this.finish();
    return true;
  }

  encounter(I, R, room, L) {
    const relIR = I.rel.get(R.idx);
    if (room === 'field') { relIR.workedBesideToday = true; R.rel.get(I.idx).workedBesideToday = true; }
    if (relIR.owesApology) {
      const d = this.lookup('T5', [this.eff(I, 'honesty'), this.eff(I, 'pride')], I, L).out[0];
      if (d === 'apologise') {
        relIR.owesApology = false;
        this.receive(R, I, 'apologised to', room, L, 'apology');
        return;
      }
    }
    let stance;
    if (relIR.grudge === 'pay back') { stance = 'hostile'; relIR.grudge = 'hold grudge'; }
    else stance = this.lookup('T3', [this.eff(I, 'warmth'), relIR.liking, I.mood], I, L).out[0];
    const act = this.lookup('T4', [stance, room, this.eff(I, 'honesty')], I, L, this.streams.act).value;
    if (NEGATIVE_ACTS.includes(act)) relIR.owesApology = true;
    this.receive(R, I, ACT_EVENT[act], room, L, act);
  }

  // A10.6 appraisal by R (I is null for night work outcomes).
  receive(R, I, event, room, L, act) {
    const pair = EVENT_INFO[event].pair;
    const b = R.beliefs[pair];
    const belief = POLES[pair][b.pole];
    const tid = pair === 'trust' ? 'T6' : pair === 'worth' ? 'T7' : 'T8';
    const inputs = tid === 'T7' ? [event, belief, b.tier, this.eff(R, 'pride')] : [event, belief, b.tier];
    const out = this.lookup(tid, inputs, R, L).out;
    const meaning = out[0], pressure = out[1], lc = tid === 'T8' ? null : out[2];
    R.gotEvent = true;
    R.todayPressure[pair].push(pressure);
    R.mood = this.lookup('T9', [R.mood, meaning], R, L).out[0];
    if (I) {
      const rel = R.rel.get(I.idx);
      const g = rel.grudge;
      let d;
      if (lc === 'down') d = -1;
      else if (g === 'cool off') d = -1;
      else if (lc === 'up') d = g === 'hold grudge' || g === 'pay back' ? 0 : 1;
      else d = 0;
      if (d !== 0) { // A10.7 counter rule
        rel.counter += d;
        if (rel.counter >= 3) { rel.liking = LIKINGS[Math.min(3, LIKINGS.indexOf(rel.liking) + 1)]; rel.counter = 0; }
        else if (rel.counter <= -3) { rel.liking = LIKINGS[Math.max(0, LIKINGS.indexOf(rel.liking) - 1)]; rel.counter = 0; }
      }
      if (meaning === 'slight' || meaning === 'insult') {
        rel.offence = meaning;
        const resp = this.lookup('T10', [this.eff(R, 'warmth'), meaning, 'none'], R, L).out[0];
        rel.grudge = resp === 'let it go' ? 'none' : resp;
      }
      if (event === 'apologised to' && rel.offence !== 'none') {
        const resp = this.lookup('T10', [this.eff(R, 'warmth'), rel.offence, 'received'], R, L).out[0];
        rel.grudge = resp === 'let it go' ? 'none' : resp;
        rel.offence = 'none';
      }
    }
    this.dayEvents[event]++;
    if (this.config.logDecisions) {
      this.events.push(`${L},${room},${I ? I.id : '-'},${R.id},${act},${event},${meaning},${pressure},${lc ?? '-'}\n`);
    }
  }

  // A11 night.
  night() {
    const cfg = this.config, L = 'night' + this.day, npcs = this.npcs;
    const moodEnd = npcs.map((p) => p.mood);
    const moodCounts = { low: 0, calm: 0, good: 0 };
    for (const m of moodEnd) moodCounts[m]++;

    for (const p of npcs) { // 1 work outcome
      if (p.fieldTicksToday < 4) continue;
      const chance = { low: 35, mid: 50, high: 65 }[p.effective.diligence];
      const ev = this.streams.work.draw(100) < chance ? 'work went well' : 'work went badly';
      this.receive(p, null, ev, '-', L, '-');
    }
    const moves = [];
    const moveCounts = { up: 0, down: 0, flip: 0, break: 0 };
    if (!cfg.loopOff) { // 2 integration
      for (const p of npcs) for (const pair of PAIRS) {
        let net = 0;
        for (const x of p.todayPressure[pair]) {
          if (x === 'stronger') net++;
          else if (x === 'weaker' || x === 'strained') net--;
        }
        const buf = p.buffer[pair];
        buf.push(Math.sign(net));
        if (buf.length > 7) buf.shift();
        let bal = 0;
        for (const x of buf) bal += x;
        const balance = bal <= -2 ? 'mostly against' : bal <= 1 ? 'mixed' : bal <= 4 ? 'mostly for' : 'strongly for';
        const b = p.beliefs[pair];
        const move = this.lookup('T11', [balance, b.tier, p.temperament.flexibility], p, L).out[0];
        const from = beliefPosition(b);
        if (applyMove(b, move)) {
          buf.length = 0;
          moveCounts[move]++;
          moves.push({ npc: p.id, pair, move, from, to: beliefPosition(b) });
        }
      }
      for (const p of npcs) this.compile(p, L); // 3 recompile
    }
    for (const p of npcs) for (const r of p.rel.values()) if (r.grudge === 'cool off') r.grudge = 'none'; // 4
    for (const p of npcs) p.mood = towardCalm(p.mood); // 5
    for (const p of npcs) { // 6
      p.energy = Math.min(100, p.energy + 60);
      p.food = Math.max(0, p.food - 10);
      p.room = 'home';
    }
    for (const p of npcs) { // 7
      p.fieldTicksToday = 0;
      p.todayPressure = { trust: [], worth: [], effort: [] };
      for (const r of p.rel.values()) r.workedBesideToday = false;
    }
    // 8 snapshot + daily metrics
    const positions = {};
    for (const pair of PAIRS) positions[pair] = { m3: 0, m2: 0, m1: 0, p1: 0, p2: 0, p3: 0 };
    for (const p of npcs) for (const pair of PAIRS) positions[pair][POS_KEYS[beliefPosition(p.beliefs[pair])]]++;
    let friendships = 0, feuds = 0, isolates = 0;
    const warm = (l) => l === 'like' || l === 'close';
    for (const p of npcs) {
      let any = false;
      for (const [j, r] of p.rel) {
        const back = npcs[j].rel.get(p.idx);
        if (warm(r.liking) || warm(back.liking)) any = true;
        if (p.idx < j) {
          if (warm(r.liking) && warm(back.liking)) friendships++;
          if (r.liking === 'dislike' && back.liking === 'dislike') feuds++;
        }
      }
      if (!any) isolates++;
    }
    this.metrics.push({ day: this.day, events: this.dayEvents, moods: moodCounts, positions, moves: moveCounts, friendships, feuds, isolates });
    this.dayEvents = zeroEvents();
    if (this.keepSnapshots) this.snapshots.push({ day: this.day, npcs: this.snapshotNpcs(moodEnd), moves });
  }

  snapshotNpcs(moods) {
    return this.npcs.map((p, k) => ({
      id: p.id,
      trust: beliefPosition(p.beliefs.trust),
      worth: beliefPosition(p.beliefs.worth),
      effort: beliefPosition(p.beliefs.effort),
      eff: EFF_TRAITS.map((t) => p.effective[t]).join(','),
      mood: moods[k],
    }));
  }

  canonicalState() {
    return this.npcs.map((p) => {
      const bel = PAIRS.map((pair) => `${pair}=${POLES[pair][p.beliefs[pair].pole]}/${p.beliefs[pair].tier}`).join('|');
      const eff = EFF_TRAITS.map((t) => p.effective[t]).join(',');
      const buf = PAIRS.map((pair) => p.buffer[pair].join(',')).join(';');
      const rel = [];
      for (const [j, r] of p.rel) rel.push(`${this.npcs[j].id}:${r.liking}:${r.counter}:${r.grudge}:${r.offence}:${r.owesApology ? 1 : 0}`);
      return `${p.id}|food=${p.food}|energy=${p.energy}|mood=${p.mood}|room=${p.room}|${bel}|eff=${eff}|buf=${buf}|rel=${rel.join(';')}`;
    }).join('\n');
  }

  decisionLogText() { return 'tick,npc,table,key,output,choice\n' + this.log.join(''); }
  eventLogText() { return 'tick,room,initiator,receiver,act,event,meaning,pressure,likingChange\n' + this.events.join(''); }

  finish() {
    this.done = true;
    this.stateHash = sha256(this.canonicalState());
    this.logHash = this.config.logDecisions ? sha256(this.decisionLogText()) : '-';
  }

  summary() {
    const stateHash = this.done ? this.stateHash : sha256(this.canonicalState());
    const logHash = this.done ? this.logHash : this.config.logDecisions ? sha256(this.decisionLogText()) : '-';
    const r3 = (x) => Math.round(x * 1000) / 1000;
    return {
      engine: VERSION,
      config: this.config,
      castHash: this.castHash,
      tableHashes: this.tableHashes,
      missingRows: { count: this.missingCount, keys: this.missingKeys },
      stateHash, logHash,
      complete: this.done,
      maxStarvingStreak: this.maxStarvingStreak,
      days: this.metrics,
      timing: {
        setupMs: r3(this.setupMs), totalMs: r3(this.elapsedMs), wakingTicks: this.wakingTicks,
        msPerTick: this.wakingTicks ? r3(this.elapsedMs / this.wakingTicks) : 0,
      },
    };
  }
}

export function runSim(config, tableFiles, castText = null) {
  const sim = new Sim(config, tableFiles, castText);
  while (!sim.done) sim.stepTick();
  return sim;
}
