// Village Core v1.0 engine. One ES module, no dependencies.
// Implements village-core-v1-spec.md Part A literally. Section numbers (A3, A10…) refer to that spec.
import { sha256 } from './sha256.js';

// ---------------------------------------------------------------- A3 vocabulary
export const V = {
  levels: ['low', 'mid', 'high'],
  traits: ['warmth', 'sociability', 'diligence', 'honesty', 'pride', 'flexibility'],
  effTraits: ['warmth', 'sociability', 'diligence', 'pride'],
  foodTiers: ['starving', 'very hungry', 'hungry', 'fed'],
  energyTiers: ['exhausted', 'very tired', 'tired', 'rested'],
  moods: ['low', 'calm', 'good'],
  likings: ['dislike', 'neutral', 'like', 'close'],
  pairs: ['trust', 'worth', 'effort'],
  poles: {
    trust: ['people mean well', 'people are against me'],
    worth: ['i am respected', 'i am overlooked'],
    effort: ['hard work pays off', 'nothing i do matters'],
  },
  tiers: ['faint', 'held', 'core'],
  rooms: ['home', 'field', 'square'],
  needs: ['none', 'eat', 'rest', 'eat now', 'rest now'],
  stances: ['friendly', 'neutral', 'cold', 'hostile'],
  roomActs: {
    field: ['help', 'chat', 'take credit', 'argue'],
    square: ['chat', 'praise', 'share food', 'interrupt', 'ignore', 'argue'],
  },
  // act -> event received; event -> pair, valence (+1 positive, -1 negative). Order = A3 events table.
  actEvent: {
    'help': 'helped', 'chat': 'chatted with', 'share food': 'shared food with', 'argue': 'argued with',
    'interrupt': 'interrupted', 'praise': 'praised', 'ignore': 'ignored', 'take credit': 'credit taken',
  },
  pairEvents: {
    trust: ['helped', 'chatted with', 'shared food with', 'argued with', 'interrupted', 'apologised to'],
    worth: ['praised', 'ignored', 'credit taken'],
    effort: ['work went well', 'work went badly'],
  },
  eventValence: {
    'helped': 1, 'chatted with': 1, 'shared food with': 1, 'argued with': -1, 'interrupted': -1,
    'apologised to': 1, 'praised': 1, 'ignored': -1, 'credit taken': -1,
    'work went well': 1, 'work went badly': -1,
  },
  negativeActs: ['argue', 'interrupt', 'ignore', 'take credit'],
  meanings: ['good sign', 'nothing much', 'slight', 'insult'],
  pressures: ['stronger', 'same', 'weaker', 'strained'],
  likingChanges: ['up', 'same', 'down'],
  grudges: ['let it go', 'cool off', 'hold grudge', 'pay back'],
  decisions: ['apologise', "don't"],
  balances: ['mostly against', 'mixed', 'mostly for', 'strongly for'],
  moves: ['stay', 'up', 'down', 'flip', 'break'],
  steps: ['-1', '0', '+1'],
};
V.eventPair = {};
for (const p of V.pairs) for (const e of V.pairEvents[p]) V.eventPair[e] = p;
V.allBeliefs = V.pairs.flatMap(p => V.poles[p]); // T12 order
V.beliefPair = {};
for (const p of V.pairs) for (const b of V.poles[p]) V.beliefPair[b] = p;

const lvlIdx = l => V.levels.indexOf(l) - 1;
const idxLvl = i => V.levels[Math.max(-1, Math.min(1, i)) + 1];

// ---------------------------------------------------------------- A6 table definitions
const PRESSURE_BY_TIER = t => (t === 'core' ? ['same', 'strained'] : ['stronger', 'same', 'weaker']);

export const TABLES = [
  { id: 'T1', name: 'needs', type: 'designer',
    inputs: [['food', V.foodTiers], ['energy', V.energyTiers]],
    outputs: [['need', () => V.needs]], def: () => ['none'] },
  { id: 'T2', name: 'action', type: 'teacher',
    inputs: [['need', ['none', 'eat', 'rest']], ['diligence', V.levels], ['sociability', V.levels]],
    outputs: [['first', () => V.rooms], ['second', () => V.rooms]], def: () => ['home', 'square'] },
  { id: 'T3', name: 'stance', type: 'teacher',
    inputs: [['warmth', V.levels], ['liking', V.likings], ['mood', V.moods]],
    outputs: [['stance', () => V.stances]], def: () => ['neutral'] },
  { id: 'T4', name: 'act', type: 'teacher',
    inputs: [['stance', V.stances], ['room', ['field', 'square']], ['honesty', V.levels]],
    outputs: [['first', r => V.roomActs[r.room]], ['second', r => V.roomActs[r.room]]], def: () => ['chat', 'chat'],
    group: 'room' },
  { id: 'T5', name: 'apology', type: 'teacher',
    inputs: [['honesty', V.levels], ['pride', V.levels]],
    outputs: [['decision', () => V.decisions]], def: () => ["don't"] },
  { id: 'T6', name: 'appraise_trust', type: 'teacher',
    inputs: [['event', V.pairEvents.trust], ['belief', V.poles.trust], ['tier', V.tiers]],
    outputs: [['meaning', () => V.meanings], ['pressure', r => PRESSURE_BY_TIER(r.tier)], ['liking_change', () => V.likingChanges]],
    def: () => ['nothing much', 'same', 'same'], group: 'tier' },
  { id: 'T7', name: 'appraise_worth', type: 'teacher',
    inputs: [['event', V.pairEvents.worth], ['belief', V.poles.worth], ['tier', V.tiers], ['pride', V.levels]],
    outputs: [['meaning', () => V.meanings], ['pressure', r => PRESSURE_BY_TIER(r.tier)], ['liking_change', () => V.likingChanges]],
    def: () => ['nothing much', 'same', 'same'], group: 'tier' },
  { id: 'T8', name: 'appraise_effort', type: 'teacher',
    inputs: [['event', V.pairEvents.effort], ['belief', V.poles.effort], ['tier', V.tiers]],
    outputs: [['meaning', () => V.meanings], ['pressure', r => PRESSURE_BY_TIER(r.tier)]],
    def: () => ['nothing much', 'same'], group: 'tier' },
  { id: 'T9', name: 'mood', type: 'teacher',
    inputs: [['mood', V.moods], ['meaning', V.meanings]],
    outputs: [['new_mood', () => V.moods]], def: inp => [inp[0]] },
  { id: 'T10', name: 'grudge', type: 'teacher',
    inputs: [['warmth', V.levels], ['offence', ['slight', 'insult']], ['apology', ['none', 'received']]],
    outputs: [['response', () => V.grudges]], def: () => ['cool off'] },
  { id: 'T11', name: 'integration', type: 'designer',
    inputs: [['balance', V.balances], ['tier', V.tiers], ['flexibility', V.levels]],
    outputs: [['move', () => V.moves]], def: () => ['stay'] },
  { id: 'T12', name: 'compile', type: 'teacher',
    inputs: [['belief', V.allBeliefs], ['tier', V.tiers]],
    outputs: [['warmth', () => V.steps], ['sociability', () => V.steps], ['diligence', () => V.steps], ['pride', () => V.steps]],
    def: () => ['0', '0', '0', '0'] },
];
export const TABLE_BY_ID = Object.fromEntries(TABLES.map(t => [t.id, t]));
export const fileName = t => `${t.id}_${t.name}.csv`;
export const header = t => [...t.inputs.map(c => c[0]), ...t.outputs.map(c => c[0])].join(',');

export function grid(t) {
  let rows = [[]];
  for (const [, vals] of t.inputs) rows = rows.flatMap(r => vals.map(v => [...r, v]));
  return rows;
}
const rowObj = (t, inp) => Object.fromEntries(t.inputs.map((c, i) => [c[0], inp[i]]));
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0); // UTF-16 code-unit order

export function normalise(t, map) {
  const keys = [...map.keys()].sort(cmp);
  let s = header(t) + '\n';
  for (const k of keys) s += [...k.split('|'), ...map.get(k)].join(',') + '\n';
  return s;
}

export function parseCsv(text) {
  const lines = text.replace(/\r/g, '').split('\n').map(l => l.trim()).filter(l => l.length);
  return { head: lines[0], rows: lines.slice(1).map(l => l.split(',').map(x => x.trim())) };
}

// Load and validate one table (A6.0). Returns { map, hash, errors }.
export function loadTable(t, text, skipValidation = false) {
  const errors = [];
  const { head, rows } = parseCsv(text);
  if (head !== header(t)) errors.push(`${t.id}: header "${head}" != "${header(t)}"`);
  const ni = t.inputs.length, no = t.outputs.length;
  const map = new Map();
  for (const r of rows) {
    if (r.length !== ni + no) { errors.push(`${t.id}: bad row length: ${r.join(',')}`); continue; }
    const inp = r.slice(0, ni), out = r.slice(ni);
    const key = inp.join('|');
    if (map.has(key)) errors.push(`${t.id}: duplicate key ${key}`);
    t.inputs.forEach(([name, vals], i) => { if (!vals.includes(inp[i])) errors.push(`${t.id}: bad input ${name}=${inp[i]}`); });
    const ro = rowObj(t, inp);
    t.outputs.forEach(([name, allowed], i) => {
      const al = allowed(ro);
      if (al && !al.includes(out[i])) errors.push(`${t.id}: illegal output ${name}=${out[i]} at ${key}`);
    });
    map.set(key, out);
  }
  for (const g of grid(t)) if (!map.has(g.join('|'))) errors.push(`${t.id}: missing row ${g.join('|')}`);
  if (errors.length && !skipValidation) throw new Error('Table validation failed:\n' + errors.join('\n'));
  return { map, hash: sha256(normalise(t, map)), errors };
}

// ---------------------------------------------------------------- A8 randomness
export function fnv1a(str) {
  let h = 0x811c9dc5;
  const bytes = new TextEncoder().encode(str);
  for (const b of bytes) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
export function mulberry32(seed) {
  let a = seed >>> 0;
  return {
    next() {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return (t ^ (t >>> 14)) >>> 0;
    },
    draw(n) { return this.next() % n; },
  };
}
export function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i >= 1; i--) {
    const j = rng.draw(i + 1);
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

// ---------------------------------------------------------------- A9 cast generator
export const CAST_HEADER = 'id,warmth,sociability,diligence,honesty,pride,flexibility,trust_pole,trust_tier,worth_pole,worth_tier,effort_pole,effort_tier';
export function generateCast(castSeed, n) {
  const rng = mulberry32(fnv1a(`cast:${castSeed}`));
  const cast = [];
  for (let k = 1; k <= n; k++) {
    const c = { id: 'n' + String(k).padStart(4, '0'), temperament: {}, beliefs: {} };
    for (const tr of V.traits) c.temperament[tr] = V.levels[rng.draw(3)];
    for (const p of V.pairs) {
      const pole = rng.draw(2) === 0 ? 0 : 1;
      const r = rng.draw(100);
      const tier = r < 50 ? 0 : r < 85 ? 1 : 2;
      c.beliefs[p] = { pole, tier };
    }
    cast.push(c);
  }
  return cast;
}
export function castCsv(cast) {
  let s = CAST_HEADER + '\n';
  for (const c of cast) {
    const parts = [c.id, ...V.traits.map(t => c.temperament[t])];
    for (const p of V.pairs) parts.push(V.poles[p][c.beliefs[p].pole], V.tiers[c.beliefs[p].tier]);
    s += parts.join(',') + '\n';
  }
  return s;
}

// ---------------------------------------------------------------- A3 tiers
const foodTier = f => (f <= 15 ? 'starving' : f <= 35 ? 'very hungry' : f <= 60 ? 'hungry' : 'fed');
const energyTier = e => (e <= 15 ? 'exhausted' : e <= 35 ? 'very tired' : e <= 60 ? 'tired' : 'rested');

export const DEFAULT_CONFIG = {
  runSeed: 1, castSeed: 1, n: 20, days: 30, hamletSize: 20, pSecond: 25,
  // Sensitivity parameters (spec values as defaults; changing them is outside spec v1.0.1)
  likingStep: 3, foodPerTick: 5, mealSize: 40, bufferDays: 7, balAgainst: -2, balFor: 2, balStrong: 5,
  tableDir: 'tables/rules', loopOff: false, traitsOff: false, tablesMode: 'csv',
  logDecisions: true, skipValidation: false,
  // Suture hook (experimental; null keeps spec behaviour): { subjects:[ids], mind:{warmth,sociability,diligence,pride,honesty}|'twin'|'random', fraction:0..1, untilDay }
  suture: null,
};

// ---------------------------------------------------------------- simulation
// tableTexts: { T1: csvText, ... T12: csvText }
export function createSim(userConfig, tableTexts) {
  const cfg = { ...DEFAULT_CONFIG, ...userConfig };
  const streams = {};
  for (const s of ['meet', 'room', 'act', 'work', 'shuffle', 'random', 'suture']) streams[s] = mulberry32(fnv1a(`${cfg.runSeed}:${s}`));

  // Load tables
  const tables = {}, tableHashes = {}, validationErrors = [];
  for (const t of TABLES) {
    const r = loadTable(t, tableTexts[t.id], cfg.skipValidation);
    tables[t.id] = r.map; tableHashes[t.id] = r.hash; validationErrors.push(...r.errors);
  }
  // A13 table modes
  if (cfg.tablesMode === 'shuffled') {
    for (const t of TABLES) {
      if (t.type !== 'teacher') continue;
      const map = tables[t.id];
      const keys = [...map.keys()].sort(cmp);
      const gi = t.group ? t.inputs.findIndex(c => c[0] === t.group) : -1;
      const groups = new Map();
      for (const k of keys) {
        const g = gi < 0 ? '' : k.split('|')[gi];
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g).push(k);
      }
      for (const gk of groups.values()) {
        const outs = gk.map(k => map.get(k));
        shuffleInPlace(outs, streams.shuffle);
        gk.forEach((k, i) => map.set(k, outs[i]));
      }
    }
  } else if (cfg.tablesMode === 'random') {
    for (const t of TABLES) {
      if (t.type !== 'teacher') continue;
      const map = tables[t.id];
      for (const k of [...map.keys()].sort(cmp)) {
        const ro = rowObj(t, k.split('|'));
        map.set(k, t.outputs.map(([, allowed]) => { const al = allowed(ro); return al[streams.random.draw(al.length)]; }));
      }
    }
  }
  if (cfg.tablesMode !== 'csv') for (const t of TABLES) tableHashes[t.id + '_used'] = sha256(normalise(t, tables[t.id]));

  // Cast and state
  const cast = generateCast(cfg.castSeed, cfg.n);
  const castHash = sha256(castCsv(cast));
  const npcs = cast.map(c => ({
    id: c.id,
    temperament: cfg.traitsOff ? Object.fromEntries(V.traits.map(t => [t, 'mid'])) : { ...c.temperament },
    beliefs: Object.fromEntries(V.pairs.map(p => [p, { ...c.beliefs[p] }])),
    eff: {}, food: 80, energy: 80, mood: 'calm', room: 'home', need: 'none',
    fieldTicksToday: 0,
    todayPressure: { trust: [], worth: [], effort: [] },
    buffer: { trust: [], worth: [], effort: [] },
    rel: {}, hamlet: 0,
  }));
  const hamlets = [];
  npcs.forEach((n, i) => {
    const h = Math.floor(i / cfg.hamletSize);
    n.hamlet = h;
    (hamlets[h] = hamlets[h] || []).push(n);
  });
  for (const hm of hamlets) for (const a of hm) for (const b of hm) if (a !== b)
    a.rel[b.id] = { liking: 'neutral', counter: 0, grudge: 'none', offence: 'none', owesApology: false, workedBesideToday: false };
  const byId = Object.fromEntries(npcs.map(n => [n.id, n]));

  // Logging
  const logLines = cfg.logDecisions ? ['tick,npc,table,key,output,choice'] : null;
  const eventLog = cfg.logDecisions ? ['tick,room,initiator,receiver,act,event,meaning,pressure,likingChange'] : null;
  const missingRows = [];
  let tickLabel = 'start';

  function look(tid, npc, inputs, choice = '-') {
    const key = inputs.join('|');
    let out = tables[tid].get(key);
    if (!out) { out = TABLE_BY_ID[tid].def(inputs); missingRows.push(`${tid}:${key}`); }
    if (logLines) logLines.push(`${tickLabel},${npc.id},${tid},${key},${out.join('|')},${choice}`);
    return out;
  }
  function lookTwo(tid, npc, inputs, stream) {
    const key = inputs.join('|');
    let out = tables[tid].get(key);
    if (!out) { out = TABLE_BY_ID[tid].def(inputs); missingRows.push(`${tid}:${key}`); }
    const second = stream.draw(100) < cfg.pSecond;
    if (logLines) logLines.push(`${tickLabel},${npc.id},${tid},${key},${out.join('|')},${second ? 'second' : 'first'}`);
    return second ? out[1] : out[0];
  }

  // Suture: on controlled days a subject's choices read the mind's traits; everything else stays its own
  const sut = cfg.suture;
  const sutSubjects = sut ? new Set(sut.subjects) : null;
  const twinMinds = {};
  let sutureDays = 0;
  function sutureActiveToday() {
    if (!sut || day >= sut.untilDay) return false;
    const f = sut.fraction;
    return Math.floor((day + 1) * f) > Math.floor(day * f);
  }
  let sutureToday = false;
  function tr(n) {
    if (!sutureToday || !sutSubjects.has(n.id)) return n.eff;
    if (sut.mind === 'twin') return twinMinds[n.id];
    if (sut.mind === 'random') {
      const o = {};
      for (const t of ['warmth', 'sociability', 'diligence', 'pride', 'honesty']) o[t] = V.levels[streams.suture.draw(3)];
      return o;
    }
    return sut.mind;
  }

  const beliefText = (n, p) => V.poles[p][n.beliefs[p].pole];
  const tierText = (n, p) => V.tiers[n.beliefs[p].tier];

  // A4 effective traits
  function recompile(n) {
    const sum = { warmth: 0, sociability: 0, diligence: 0, pride: 0 };
    for (const p of V.pairs) {
      const out = look('T12', n, [beliefText(n, p), tierText(n, p)]);
      V.effTraits.forEach((t, i) => { sum[t] += parseInt(out[i], 10); });
    }
    for (const t of V.effTraits) n.eff[t] = idxLvl(lvlIdx(n.temperament[t]) + sum[t]);
    n.eff.honesty = n.temperament.honesty;
    n.eff.flexibility = n.temperament.flexibility;
  }

  // A10.7
  function addCounter(rel, delta) {
    if (!delta) return;
    rel.counter += delta;
    if (rel.counter >= cfg.likingStep) { rel.liking = V.likings[Math.min(3, V.likings.indexOf(rel.liking) + 1)]; rel.counter = 0; }
    else if (rel.counter <= -cfg.likingStep) { rel.liking = V.likings[Math.max(0, V.likings.indexOf(rel.liking) - 1)]; rel.counter = 0; }
  }

  // metrics accumulators
  let dayEvents = {}, dayMoves = {};
  const resetDayMetrics = () => {
    dayEvents = Object.fromEntries(Object.keys(V.eventValence).map(e => [e, 0]));
    dayMoves = Object.fromEntries(V.moves.filter(m => m !== 'stay').map(m => [m, 0]));
  };
  resetDayMetrics();

  // A10.6 appraisal by R of event from I (I may be null for work events)
  function appraise(R, I, event, room, act) {
    const pair = V.eventPair[event];
    const tid = pair === 'trust' ? 'T6' : pair === 'worth' ? 'T7' : 'T8';
    const inputs = [event, beliefText(R, pair), tierText(R, pair)];
    if (tid === 'T7') inputs.push(R.eff.pride);
    const out = look(tid, R, inputs);
    const meaning = out[0], pressure = out[1], lc = tid === 'T8' ? 'same' : out[2];
    dayEvents[event]++;
    R.gotEvent = true;
    R.todayPressure[pair].push(pressure);
    R.mood = look('T9', R, [R.mood, meaning])[0];
    if (I) {
      const rel = R.rel[I.id];
      const g = rel.grudge;
      let delta = lc === 'up' ? 1 : lc === 'down' ? -1 : 0;
      if (delta === 1 && (g === 'hold grudge' || g === 'pay back')) delta = 0;
      if (g === 'cool off' && delta >= 0) delta = -1;
      addCounter(rel, delta);
      if (meaning === 'slight' || meaning === 'insult') {
        rel.offence = meaning;
        const resp = look('T10', R, [R.eff.warmth, meaning, 'none'])[0];
        rel.grudge = resp === 'let it go' ? 'none' : resp;
      }
      if (event === 'apologised to' && rel.offence !== 'none') {
        const resp = look('T10', R, [R.eff.warmth, rel.offence, 'received'])[0];
        rel.grudge = resp === 'let it go' ? 'none' : resp;
        rel.offence = 'none';
      }
    }
    if (eventLog) eventLog.push(`${tickLabel},${room},${I ? I.id : '-'},${R.id},${act},${event},${meaning},${pressure},${lc}`);
  }

  // A10.6 one encounter
  function encounter(a, b, room) {
    const firstInit = streams.meet.draw(2) === 0;
    const I = firstInit ? a : b, R = firstInit ? b : a;
    if (room === 'field') {
      const ir = I.rel[R.id], rr = R.rel[I.id];
      if (!ir.workedBesideToday) {
        ir.workedBesideToday = true; rr.workedBesideToday = true;
        // (worked beside: recorded only; no liking effect in v1)
      }
    }
    const irel = I.rel[R.id];
    if (irel.owesApology) {
      const m = tr(I); const d = look('T5', I, [m.honesty, m.pride])[0];
      if (d === 'apologise') {
        irel.owesApology = false;
        appraise(R, I, 'apologised to', room, 'apologise');
        return;
      }
    }
    let stance;
    if (irel.grudge === 'pay back') { stance = 'hostile'; irel.grudge = 'hold grudge'; }
    else stance = look('T3', I, [tr(I).warmth, irel.liking, I.mood])[0];
    const act = lookTwo('T4', I, [stance, room, tr(I).honesty], streams.act);
    if (V.negativeActs.includes(act)) irel.owesApology = true;
    appraise(R, I, V.actEvent[act], room, act);
  }

  // A10 one waking tick
  let day = 0, hour = 0;
  function tick() {
    tickLabel = String(day * 16 + hour);
    if (hour === 0 && sut) {
      if (day === 0 && sut.mind === 'twin') for (const n of npcs) if (sutSubjects.has(n.id)) twinMinds[n.id] = { ...n.eff };
      sutureToday = sutureActiveToday(); if (sutureToday) sutureDays++;
    }
    for (const n of npcs) n.gotEvent = false;
    for (const n of npcs) {
      const wasField = n.room === 'field';
      n.food = Math.max(0, n.food - cfg.foodPerTick);
      n.energy = Math.max(0, n.energy - (wasField ? 6 : 4));
    }
    for (const n of npcs) n.need = look('T1', n, [foodTier(n.food), energyTier(n.energy)])[0];
    for (const n of npcs) {
      if (n.need === 'eat now' || n.need === 'rest now') n.room = 'home';
      else { const m = tr(n); n.room = lookTwo('T2', n, [n.need, m.diligence, m.sociability], streams.room); }
    }
    for (const n of npcs) {
      if (n.room !== 'home') continue;
      if (n.need === 'eat' || n.need === 'eat now') n.food = Math.min(100, n.food + cfg.mealSize);
      if (n.need === 'rest' || n.need === 'rest now') n.energy = Math.min(100, n.energy + 15);
      if (n.need === 'none') n.energy = Math.min(100, n.energy + 5);
    }
    for (const n of npcs) if (n.room === 'field') n.fieldTicksToday++;
    for (const hm of hamlets) {
      for (const room of ['field', 'square']) {
        const occ = hm.filter(n => n.room === room); // already id-sorted
        shuffleInPlace(occ, streams.meet);
        for (let i = 0; i + 1 < occ.length; i += 2) encounter(occ[i], occ[i + 1], room);
      }
    }
    // A10.8 a quiet hour (no event received) moves mood one step toward calm
    for (const n of npcs) if (!n.gotEvent) n.mood = 'calm';
    hour++;
  }

  // A11 night
  const snapshots = [], dailyMetrics = [];
  function night() {
    tickLabel = 'night' + day;
    const moves = [];
    for (const n of npcs) {
      if (n.fieldTicksToday >= 4) {
        const chance = { low: 35, mid: 50, high: 65 }[n.eff.diligence];
        const ev = streams.work.draw(100) < chance ? 'work went well' : 'work went badly';
        appraise(n, null, ev, 'field', '-');
      }
    }
    if (!cfg.loopOff) {
      for (const n of npcs) {
        for (const p of V.pairs) {
          const tp = n.todayPressure[p];
          const net = tp.filter(x => x === 'stronger').length - tp.filter(x => x === 'weaker').length - tp.filter(x => x === 'strained').length;
          const val = Math.sign(net); // one vote per day (A11.2)
          n.buffer[p].push(val);
          if (n.buffer[p].length > cfg.bufferDays) n.buffer[p].shift();
          const sum = n.buffer[p].reduce((s, x) => s + x, 0);
          const bal = sum <= cfg.balAgainst ? 'mostly against' : sum < cfg.balFor ? 'mixed' : sum < cfg.balStrong ? 'mostly for' : 'strongly for';
          const mv = look('T11', n, [bal, tierText(n, p), n.eff.flexibility])[0];
          const b = n.beliefs[p];
          let changed = false;
          if (mv === 'up' && b.tier < 2) { b.tier++; changed = true; }
          else if (mv === 'down' && b.tier > 0) { b.tier--; changed = true; }
          else if (mv === 'flip' && b.tier === 0) { b.pole = 1 - b.pole; changed = true; }
          else if (mv === 'break' && b.tier === 2) { b.pole = 1 - b.pole; b.tier = 0; changed = true; }
          if (changed) { n.buffer[p] = []; dayMoves[mv]++; moves.push(`${n.id}:${p}:${mv}`); }
        }
      }
      for (const n of npcs) recompile(n);
    }
    for (const n of npcs) for (const r of Object.values(n.rel)) if (r.grudge === 'cool off') r.grudge = 'none';
    for (const n of npcs) n.mood = 'calm'; // one step toward calm (3-level ladder)
    for (const n of npcs) { n.energy = Math.min(100, n.energy + 60); n.food = Math.max(0, n.food - 10); n.room = 'home'; }
    for (const n of npcs) {
      n.fieldTicksToday = 0;
      n.todayPressure = { trust: [], worth: [], effort: [] };
      for (const r of Object.values(n.rel)) r.workedBesideToday = false;
    }
    snapshots.push({ day, moves, npcs: npcs.map((n, i) => ({ id: n.id, pos: positions(n), eff: { ...n.eff }, mood: preNightMood[i] })) });
    dailyMetrics.push(computeMetrics());
    resetDayMetrics();
    day++; hour = 0;
  }

  function positions(n) {
    const o = {};
    for (const p of V.pairs) { const b = n.beliefs[p]; o[p] = (b.pole === 0 ? 1 : -1) * (b.tier + 1); }
    return o;
  }

  function computeMetrics() {
    const moodCounts = { low: 0, calm: 0, good: 0 };
    // moods are measured before the night reset would hide them: we record end-of-day snapshot after reset,
    // so mood counts here reflect post-night mood (always calm). Pre-night moods are captured in preNightMood.
    const pos = {};
    for (const p of V.pairs) pos[p] = { '-3': 0, '-2': 0, '-1': 0, '1': 0, '2': 0, '3': 0 };
    for (const n of npcs) { const ps = positions(n); for (const p of V.pairs) pos[p][ps[p]]++; }
    let friendships = 0, feuds = 0;
    const warm = l => l === 'like' || l === 'close';
    const hasWarm = new Set();
    for (const hm of hamlets) for (let i = 0; i < hm.length; i++) for (let j = i + 1; j < hm.length; j++) {
      const a = hm[i], b = hm[j], ab = a.rel[b.id].liking, ba = b.rel[a.id].liking;
      if (warm(ab) && warm(ba)) friendships++;
      if (ab === 'dislike' && ba === 'dislike') feuds++;
      if (warm(ab) || warm(ba)) { hasWarm.add(a.id); hasWarm.add(b.id); }
    }
    for (const m of preNightMood) moodCounts[m]++;
    return { day, events: { ...dayEvents }, moods: moodCounts, positions: pos, moves: { ...dayMoves },
      friendships, feuds, isolates: npcs.length - hasWarm.size };
  }
  let preNightMood = [];

  function initialCompile() { tickLabel = 'start'; for (const n of npcs) recompile(n); }

  function canonicalState() {
    return npcs.map(n => {
      const rel = Object.keys(n.rel).sort((x, y) => parseInt(x.slice(1), 10) - parseInt(y.slice(1), 10)).map(o => { // numeric id order (A4)
        const r = n.rel[o];
        return `${o}:${r.liking}:${r.counter}:${r.grudge}:${r.offence}:${r.owesApology ? 1 : 0}`;
      }).join(';');
      const bel = V.pairs.map(p => `${p}=${beliefText(n, p)}/${tierText(n, p)}`).join('|');
      const buf = V.pairs.map(p => n.buffer[p].join(',')).join(';');
      return `${n.id}|food=${n.food}|energy=${n.energy}|mood=${n.mood}|room=${n.room}|${bel}|eff=${n.eff.warmth},${n.eff.sociability},${n.eff.diligence},${n.eff.pride}|buf=${buf}|rel=${rel}`;
    }).join('\n');
  }

  initialCompile();

  const sim = {
    cfg, npcs, byId, hamlets, tables, tableHashes, castHash, validationErrors, missingRows,
    snapshots, dailyMetrics, logLines, eventLog,
    get day() { return day; }, get hour() { return hour; },
    stepTick() {
      if (day >= cfg.days) return false;
      tick();
      if (hour === 16) { preNightMood = npcs.map(n => n.mood); night(); }
      return day < cfg.days;
    },
    runAll() {
      const t0 = now();
      while (day < cfg.days) sim.stepTick();
      sim.elapsedMs = now() - t0;
      return sim;
    },
    canonicalState,
    summary() {
      const ticks = cfg.days * 16;
      return {
        engine: 'village-core-v1.0', config: cfg, castHash, tableHashes,
        missingRows: missingRows.length, missingKeys: [...new Set(missingRows)].slice(0, 50),
        stateHash: sha256(canonicalState()),
        logHash: logLines ? sha256(logLines.join('\n') + '\n') : '-',
        timing: { totalMs: sim.elapsedMs ?? null, msPerTick: sim.elapsedMs != null ? sim.elapsedMs / ticks : null },
        dailyMetrics,
      };
    },
    decisionLogText() { return logLines ? logLines.join('\n') + '\n' : ''; },
    eventLogText() { return eventLog ? eventLog.join('\n') + '\n' : ''; },
  };
  return sim;
}

function now() {
  // Used only to measure time, never for decisions (A2.1).
  if (typeof performance !== 'undefined' && performance.now) return performance.now();
  return Date.now();
}
