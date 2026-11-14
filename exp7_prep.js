// Experiment 7 (prep): compiled tables vs hand-written rules vs a live LLM, at the level of single decisions.
// Samples 40 real decision points from a consensus-table village (seed 101, 20 villagers, days 8-30),
// writes the live-LLM prompt (pack/exp7_live_prompt.md) and the answer key (reports/exp7_items.json).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { TABLES, fileName, createSim, loadTable, TABLE_BY_ID, mulberry32, shuffleInPlace } from './engine.js';

const read = d => Object.fromEntries(TABLES.map(t => [t.id, readFileSync(`tables/${d}/${fileName(t)}`, 'utf8')]));
const cons = read('consensus_blind8');
const rulesMap = Object.fromEntries(TABLES.map(t => [t.id, loadTable(t, readFileSync(`tables/rules/${fileName(t)}`, 'utf8')).map]));
const consMap = Object.fromEntries(TABLES.map(t => [t.id, loadTable(t, cons[t.id]).map]));

const sim = createSim({ runSeed: 101, n: 20, days: 30, logDecisions: true }, cons);
const snaps = {}; // tick -> deep copy of npc state before that tick
const LIKE = { dislike: 'dislikes', neutral: 'feels neutral about', like: 'likes', close: 'is close to' };
while (sim.day < 30) {
  const tick = sim.day * 16 + sim.hour;
  if (sim.day >= 8) snaps[tick] = JSON.parse(JSON.stringify(sim.npcs.map(n => ({ id: n.id, eff: n.eff, temperament: n.temperament, beliefs: n.beliefs, mood: n.mood, rel: n.rel }))));
  sim.stepTick();
}
const log = sim.logLines.slice(1).map(l => l.split(','));
const ev = sim.eventLog.slice(1).map(l => l.split(','));
const POLES = { trust: ['people mean well', 'people are against me'], worth: ['i am respected', 'i am overlooked'], effort: ['hard work pays off', 'nothing i do matters'] };
const TIER = ['faint', 'held', 'core'], TIERW = { faint: 'faintly', held: 'firmly', core: 'deeply, as part of who they are' };

function person(s, id) {
  const n = s.find(x => x.id === id);
  const traits = ['warmth', 'sociability', 'diligence', 'honesty', 'pride'].map(t => `${t} ${n.eff[t]}`).join(', ');
  const bel = Object.keys(POLES).map(p => `"${POLES[p][n.beliefs[p].pole]}" (${TIERW[TIER[n.beliefs[p].tier]]})`).join('; ');
  return { n, text: `Personality: ${traits}. Beliefs: ${bel}. Mood right now: ${n.mood}.` };
}
const PAST = { 'help': 'helped', 'chat': 'chatted with', 'take credit': 'took credit for the work of', 'argue': 'argued with', 'praise': 'praised', 'share food': 'shared food with', 'interrupt': 'interrupted', 'ignore': 'ignored', 'apologise': 'apologised to' };
function history(id, other, beforeTick) {
  const rel = ev.filter(f => +f[0] < beforeTick && f[2] !== '-' && ((f[2] === id && f[3] === other) || (f[2] === other && f[3] === id))).slice(-3);
  if (!rel.length) return 'No notable history between them recently.';
  return 'Recent history between them: ' + rel.map(f => `day ${Math.floor(+f[0] / 16) + 1}, ${f[2]} ${PAST[f[4]]} ${f[3]}`).join('; ') + '.';
}
const NEEDW = { none: 'feels fine', eat: 'is getting hungry', rest: 'is getting tired' };

// Candidate pools
const rng = mulberry32(2026);
const items = [];
const pick = (arr, k, keyFn) => { // diverse sample: prefer distinct keys
  shuffleInPlace(arr, rng); const seen = new Set(), out = [];
  for (const a of arr) { const k2 = keyFn(a); if (!seen.has(k2)) { seen.add(k2); out.push(a); } if (out.length >= k) break; }
  for (const a of arr) { if (out.length >= k) break; if (!out.includes(a)) out.push(a); }
  return out;
};
// Room choices
const roomC = log.filter(f => f[2] === 'T2' && snaps[+f[0]] && f[3].split('|')[0] !== 'eat now');
for (const f of pick(roomC, 12, f => f[3])) {
  const tick = +f[0], s = snaps[tick], p = person(s, f[1]);
  const [need, dil, soc] = f[3].split('|');
  items.push({ type: 'room', tick, npc: f[1], key: f[3], table: consMap.T2.get(f[3])[0], rules: rulesMap.T2.get(f[3])[0],
    text: `Day ${Math.floor(tick / 16) + 1}, hour ${tick % 16 + 1} of 16. Villager ${f[1]} ${NEEDW[need]}. ${p.text}\nWhere does ${f[1]} go for the next hour? (home = eat or rest, field = work, square = socialise)`,
    allowed: ['home', 'field', 'square'] });
}
// Encounters (initiator acts)
const actC = log.filter(f => f[2] === 'T4' && snaps[+f[0]]);
for (const f of pick(actC, 14, f => f[3])) {
  const tick = +f[0], s = snaps[tick];
  const e = ev.find(x => +x[0] === tick && x[2] === f[1] && x[4] !== 'apologise');
  if (!e) continue;
  const other = e[3], p = person(s, f[1]), [stance, room, hon] = f[3].split('|');
  const liking = p.n.rel[other].liking, grudge = p.n.rel[other].grudge;
  const stLine = log.find(x => +x[0] === tick && x[1] === f[1] && x[2] === 'T3');
  const rStance = stLine ? rulesMap.T3.get(stLine[3])[0] : stance;
  items.push({ type: 'act', tick, npc: f[1], other, key: f[3], table: consMap.T4.get(f[3])[0], rules: rulesMap.T4.get([rStance, room, hon].join('|'))[0],
    text: `Day ${Math.floor(tick / 16) + 1}. Villager ${f[1]} meets ${other} in the ${room}. ${p.text} ${f[1]} ${LIKE[liking]} ${other}${grudge !== 'none' ? ` and is holding a grudge (${grudge})` : ''}. ${history(f[1], other, tick)}\nWhat does ${f[1]} do? Allowed: ${room === 'field' ? 'help, chat, take credit, argue' : 'chat, praise, share food, interrupt, ignore, argue'}.`,
    allowed: room === 'field' ? ['help', 'chat', 'take credit', 'argue'] : ['chat', 'praise', 'share food', 'interrupt', 'ignore', 'argue'] });
}
// Reactions
const EVW = { 'helped': 'helped them with their work', 'chatted with': 'made small talk with them', 'shared food with': 'shared food with them', 'argued with': 'argued with them', 'interrupted': 'interrupted them', 'apologised to': 'apologised to them for an earlier unkindness', 'praised': 'praised them', 'ignored': 'ignored them', 'credit taken': 'took credit for their work' };
const reC = log.filter(f => (f[2] === 'T6' || f[2] === 'T7') && snaps[+f[0]] && !f[3].startsWith('chatted with'));
for (const f of pick(reC, 14, f => f[2] + f[3].split('|')[0] + f[3].split('|')[2])) {
  const tick = +f[0], s = snaps[tick];
  const evk = f[3].split('|')[0];
  const e = ev.find(x => +x[0] === tick && x[3] === f[1] && x[5] === evk);
  if (!e) continue;
  const other = e[2], p = person(s, f[1]);
  const liking = p.n.rel[other].liking;
  const c = consMap[f[2]].get(f[3]), r = rulesMap[f[2]].get(f[3]);
  items.push({ type: 'reaction', tick, npc: f[1], other, key: f[2] + ':' + f[3], table: c[0] + '/' + c[2], rules: r[0] + '/' + r[2],
    text: `Day ${Math.floor(tick / 16) + 1}. ${other} just ${EVW[evk].replace(/their/g, f[1] + "'s").replace(/them/g, f[1])}. About ${f[1]}: ${p.text} Before this, ${f[1]} ${LIKE[liking]} ${other}. ${history(f[1], other, tick)}\nHow does ${f[1]} take it, and how do they now feel toward ${other}? Answer meaning (good sign, nothing much, slight, insult) and liking change (up, same, down).`,
    allowed: null });
}
items.forEach((it, i) => { it.id = 'Q' + String(i + 1).padStart(2, '0'); });

const prompt = `You are deciding what ordinary people in a small farming village do. Everyone lives alone, works in a shared field, and meets others in the village square; at home they eat and rest. Picture believable, ordinary villagers with everyday flaws. For each situation, give the single most likely answer for this particular person, using only the allowed words.

**How to reply**
- Start with one plain line: \`model: <your model name and version, as far as you know it>\`.
- Then one CSV code block with the header \`id,answer\` for "where" and "what does" questions, and \`id,meaning,liking_change\` for "how does … take it" questions. You may put both kinds in one block, one row per question, leaving unused columns empty: use the header \`id,answer,meaning,liking_change\`.
- No other commentary.

${items.map(it => `**${it.id}.** ${it.text}`).join('\n\n')}
`;
mkdirSync('pack', { recursive: true }); mkdirSync('reports', { recursive: true });
writeFileSync('pack/exp7_live_prompt.md', prompt);
writeFileSync('reports/exp7_items.json', JSON.stringify(items, null, 1));
const c = t => items.filter(i => i.type === t).length;
console.log(`items: ${items.length} (room ${c('room')}, act ${c('act')}, reaction ${c('reaction')}); prompt words ${prompt.split(/\s+/).length}`);
console.log('tables vs rules agree on', items.filter(i => i.table === i.rules).length, 'of', items.length);
