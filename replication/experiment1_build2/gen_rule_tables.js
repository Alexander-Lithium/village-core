// gen_rule_tables.js — writes the A6.1 rule tables to tables/rules/*.csv (normalised form).
import fs from 'node:fs';
import path from 'node:path';
import { TABLE_SCHEMAS, LEVELS, LIKINGS, MOODS, EVENT_INFO, POLES, grid, normalisedTableText, loadTables } from './engine.js';

const i = (lvl) => LEVELS.indexOf(lvl) - 1;
const likingIdx = (l) => LIKINGS.indexOf(l) - 1; // dislike -1, neutral 0, like +1, close +2
const moodIdx = (m) => MOODS.indexOf(m) - 1;

function appraise(ev, belief, tier, pride, withLiking) {
  const { pair, valence: v } = EVENT_INFO[ev];
  const p = belief === POLES[pair].pos ? 1 : -1;
  let meaning, pressure;
  if (ev === 'chatted with') {
    meaning = 'nothing much'; pressure = 'same';
  } else {
    if (v === p) { // confirming
      pressure = tier === 'core' ? 'same' : 'stronger';
      meaning = v > 0 ? 'good sign' : tier === 'faint' ? 'slight' : 'insult';
    } else { // contradicting
      pressure = tier === 'core' ? 'strained' : 'weaker';
      meaning = v > 0 ? (tier === 'faint' ? 'good sign' : 'nothing much') : 'slight';
    }
    if (pride && v < 0) {
      const order = ['nothing much', 'slight', 'insult'];
      let k = order.indexOf(meaning);
      if (pride === 'high') k = Math.min(2, k + 1);
      if (pride === 'low') k = Math.max(0, k - 1);
      meaning = order[k];
    }
  }
  const lc = meaning === 'good sign' ? 'up' : meaning === 'nothing much' ? 'same' : 'down';
  return withLiking ? [meaning, pressure, lc] : [meaning, pressure];
}

const T12_STEPS = {
  'people mean well': { held: { warmth: 1 }, core: { warmth: 1, sociability: 1 } },
  'people are against me': { held: { warmth: -1 }, core: { warmth: -1, sociability: -1 } },
  'i am respected': { core: { pride: 1 } },
  'i am overlooked': { held: { sociability: -1 }, core: { sociability: -1, pride: 1 } },
  'hard work pays off': { held: { diligence: 1 }, core: { diligence: 1 } },
  'nothing i do matters': { held: { diligence: -1 }, core: { diligence: -1, sociability: -1 } },
};

const RULES = {
  T1: ([food, energy]) => {
    if (food === 'starving') return ['eat now'];
    if (energy === 'exhausted') return ['rest now'];
    if (food === 'very hungry') return ['eat'];
    if (energy === 'very tired') return ['rest'];
    if (food === 'hungry' && energy === 'tired') return ['eat'];
    return ['none'];
  },
  T2: ([need, dil, soc]) => {
    if (need !== 'none') return ['home', dil === 'high' ? 'field' : 'square'];
    const fs = i(dil), ss = i(soc);
    const first = ss > fs ? 'square' : 'field';
    let second = first === 'field' ? 'square' : 'field';
    if (fs === -1 && ss === -1) second = 'home';
    return [first, second];
  },
  T3: ([w, l, m]) => {
    const s = i(w) + likingIdx(l) + moodIdx(m);
    return [s >= 2 ? 'friendly' : s >= 0 ? 'neutral' : s === -1 ? 'cold' : 'hostile'];
  },
  T4: ([stance, room, hon]) => {
    const low = hon === 'low';
    if (room === 'field') {
      if (stance === 'friendly') return ['help', 'chat'];
      if (stance === 'neutral') return ['chat', 'help'];
      if (stance === 'cold') return low ? ['chat', 'take credit'] : ['chat', 'chat'];
      return low ? ['argue', 'take credit'] : ['argue', 'chat'];
    }
    if (stance === 'friendly') return ['praise', 'share food'];
    if (stance === 'neutral') return low ? ['chat', 'ignore'] : ['chat', 'chat'];
    if (stance === 'cold') return ['ignore', 'interrupt'];
    return ['argue', 'interrupt'];
  },
  T5: ([hon, pride]) => [i(hon) - i(pride) >= 0 ? 'apologise' : "don't"],
  T6: ([ev, belief, tier]) => appraise(ev, belief, tier, null, true),
  T7: ([ev, belief, tier, pride]) => appraise(ev, belief, tier, pride, true),
  T8: ([ev, belief, tier]) => appraise(ev, belief, tier, null, false),
  T9: ([mood, meaning]) => {
    const k = MOODS.indexOf(mood);
    if (meaning === 'good sign') return [MOODS[Math.min(2, k + 1)]];
    if (meaning === 'nothing much') return [mood];
    if (meaning === 'slight') return [MOODS[Math.max(0, k - 1)]];
    return ['low'];
  },
  T10: ([w, off, ap]) => {
    const g = i(w) + (ap === 'received' ? 1 : 0) - (off === 'insult' ? 1 : 0);
    return [g >= 1 ? 'let it go' : g === 0 ? 'cool off' : g === -1 ? 'hold grudge' : 'pay back'];
  },
  T11: ([bal, tier, flex]) => {
    if (bal === 'strongly for') return [tier === 'core' ? 'stay' : 'up'];
    if (bal === 'mostly for') return [flex === 'high' && tier !== 'core' ? 'up' : 'stay'];
    if (bal === 'mixed') return ['stay'];
    if (tier === 'faint') return [flex === 'low' ? 'stay' : 'flip'];
    if (tier === 'held') return [flex === 'low' ? 'stay' : 'down'];
    return [flex === 'high' ? 'break' : flex === 'mid' ? 'down' : 'stay'];
  },
  T12: ([belief, tier]) => ['warmth', 'sociability', 'diligence', 'pride'].map((t) => {
    const v = (T12_STEPS[belief][tier] || {})[t] || 0;
    return v > 0 ? '+1' : v < 0 ? '-1' : '0';
  }),
};

const dir = path.join('tables', 'rules');
fs.mkdirSync(dir, { recursive: true });
const files = {};
for (const s of TABLE_SCHEMAS) {
  const rows = new Map();
  for (const combo of grid(s)) rows.set(combo.join('|'), RULES[s.id](combo));
  files[s.file] = normalisedTableText(s, rows);
  fs.writeFileSync(path.join(dir, s.file), files[s.file]);
}
const { tables, errors } = loadTables(files);
if (errors.length) { console.error('Generated tables failed validation:\n' + errors.join('\n')); process.exit(1); }
for (const s of TABLE_SCHEMAS) console.log(`${s.file.padEnd(24)} ${String(tables[s.id].rows.size).padStart(3)} rows  ${tables[s.id].hash}`);
console.log(`wrote ${TABLE_SCHEMAS.length} tables to ${dir}`);
