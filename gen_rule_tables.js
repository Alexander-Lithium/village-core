// Writes the baseline rule tables (spec A6.1) to tables/rules/*.csv in normalised form.
import { writeFileSync, mkdirSync } from 'node:fs';
import { V, TABLES, grid, normalise, fileName } from './engine.js';

const i = l => V.levels.indexOf(l) - 1;
const likingI = l => V.likings.indexOf(l) - 1; // dislike -1 .. close +2
const moodI = m => V.moods.indexOf(m) - 1;

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
    if (need === 'eat' || need === 'rest') return ['home', dil === 'high' ? 'field' : 'square'];
    const f = i(dil), q = i(soc);
    const first = f >= q ? 'field' : 'square';
    let second = first === 'field' ? 'square' : 'field';
    if (f === -1 && q === -1) second = 'home';
    return [first, second];
  },
  T3: ([w, lk, m]) => {
    const s = i(w) + likingI(lk) + moodI(m);
    return [s >= 2 ? 'friendly' : s >= 0 ? 'neutral' : s === -1 ? 'cold' : 'hostile'];
  },
  T4: ([stance, room, hon]) => {
    const low = hon === 'low';
    if (room === 'field') {
      if (stance === 'friendly') return ['help', 'chat'];
      if (stance === 'neutral') return ['chat', 'help'];
      if (stance === 'cold') return ['chat', low ? 'take credit' : 'chat'];
      return ['argue', low ? 'take credit' : 'chat'];
    }
    if (stance === 'friendly') return ['praise', 'share food'];
    if (stance === 'neutral') return ['chat', low ? 'ignore' : 'chat'];
    if (stance === 'cold') return ['ignore', 'interrupt'];
    return ['argue', 'interrupt'];
  },
  T5: ([hon, pride]) => [i(hon) - i(pride) >= 0 ? 'apologise' : "don't"],
};

const ORDER = ['nothing much', 'slight', 'insult'];
function appraise(event, belief, tier, pride) {
  if (event === 'chatted with') return { meaning: 'nothing much', pressure: 'same', lc: 'same' }; // small talk is routine
  const v = V.eventValence[event];
  const pair = Object.keys(V.poles).find(p => V.poles[p].includes(belief));
  const p = V.poles[pair][0] === belief ? 1 : -1;
  const confirming = v === p;
  let meaning, pressure;
  if (confirming) {
    pressure = tier === 'core' ? 'same' : 'stronger';
    meaning = v > 0 ? 'good sign' : (tier === 'faint' ? 'slight' : 'insult');
  } else {
    pressure = tier === 'core' ? 'strained' : 'weaker';
    meaning = v > 0 ? (tier === 'faint' ? 'good sign' : 'nothing much') : 'slight';
  }
  if (pride && v < 0) {
    const k = ORDER.indexOf(meaning);
    if (pride === 'high') meaning = ORDER[Math.min(2, k + 1)];
    if (pride === 'low') meaning = ORDER[Math.max(0, k - 1)];
  }
  const lc = meaning === 'good sign' ? 'up' : meaning === 'nothing much' ? 'same' : 'down';
  return { meaning, pressure, lc };
}
RULES.T6 = ([e, b, t]) => { const r = appraise(e, b, t); return [r.meaning, r.pressure, r.lc]; };
RULES.T7 = ([e, b, t, pr]) => { const r = appraise(e, b, t, pr); return [r.meaning, r.pressure, r.lc]; };
RULES.T8 = ([e, b, t]) => { const r = appraise(e, b, t); return [r.meaning, r.pressure]; };
RULES.T9 = ([m, meaning]) => {
  const k = V.moods.indexOf(m);
  if (meaning === 'good sign') return [V.moods[Math.min(2, k + 1)]];
  if (meaning === 'nothing much') return [m];
  if (meaning === 'slight') return [V.moods[Math.max(0, k - 1)]];
  return ['low'];
};
RULES.T10 = ([w, off, ap]) => {
  const g = i(w) + (ap === 'received' ? 1 : 0) - (off === 'insult' ? 1 : 0);
  return [g >= 1 ? 'let it go' : g === 0 ? 'cool off' : g === -1 ? 'hold grudge' : 'pay back'];
};
RULES.T11 = ([bal, tier, flex]) => {
  if (bal === 'strongly for') return [tier === 'core' ? 'stay' : 'up'];
  if (bal === 'mostly for') return [flex === 'high' && tier !== 'core' ? 'up' : 'stay'];
  if (bal === 'mixed') return ['stay'];
  if (tier === 'faint') return [flex === 'low' ? 'stay' : 'flip'];
  if (tier === 'held') return [flex === 'low' ? 'stay' : 'down'];
  return [flex === 'high' ? 'break' : flex === 'mid' ? 'down' : 'stay'];
};
const COMPILE = {
  'people mean well': { held: { warmth: 1 }, core: { warmth: 1, sociability: 1 } },
  'people are against me': { held: { warmth: -1 }, core: { warmth: -1, sociability: -1 } },
  'i am respected': { core: { pride: 1 } },
  'i am overlooked': { held: { sociability: -1 }, core: { sociability: -1, pride: 1 } },
  'hard work pays off': { held: { diligence: 1 }, core: { diligence: 1 } },
  'nothing i do matters': { held: { diligence: -1 }, core: { diligence: -1, sociability: -1 } },
};
const stepStr = x => (x > 0 ? '+1' : x < 0 ? '-1' : '0');
RULES.T12 = ([b, t]) => {
  const s = (COMPILE[b][t]) || {};
  return ['warmth', 'sociability', 'diligence', 'pride'].map(k => stepStr(s[k] || 0));
};

export function ruleTableTexts() {
  const out = {};
  for (const t of TABLES) {
    const map = new Map();
    for (const g of grid(t)) map.set(g.join('|'), RULES[t.id](g));
    out[t.id] = normalise(t, map);
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = process.argv[2] || 'tables/rules';
  mkdirSync(dir, { recursive: true });
  const texts = ruleTableTexts();
  let total = 0;
  for (const t of TABLES) {
    writeFileSync(`${dir}/${fileName(t)}`, texts[t.id]);
    total += texts[t.id].trim().split('\n').length - 1;
  }
  console.log(`Wrote ${TABLES.length} tables (${total} rows) to ${dir}`);
}
