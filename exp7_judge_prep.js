// Experiment 7 judge prompt: situations where the four sources disagree; distinct answers shown blind, in shuffled order.
import { readFileSync, writeFileSync } from 'node:fs';
import { mulberry32, fnv1a } from './engine.js';
const items = JSON.parse(readFileSync('reports/exp7_items.json', 'utf8'));
const { live } = JSON.parse(readFileSync('reports/exp7_agreement.json', 'utf8'));
const rng = mulberry32(fnv1a('exp7-judge'));
const say = (it, a) => it.type === 'reaction' ? (([m, l]) => `takes it as "${m}"; liking ${l === 'up' ? 'goes up' : l === 'down' ? 'goes down' : 'stays the same'}`)(a.split('/')) : it.type === 'room' ? `goes to the ${a}` : `chooses to ${a}`;
const key = [], blocks = [];
let k = 0;
for (const it of items) {
  const src = { table: it.table, rules: it.rules, opus55: live.opus55[it.id], gpt6: live.gpt6[it.id] };
  const distinct = [...new Set(Object.values(src))];
  if (distinct.length < 2) continue;
  for (let i = distinct.length - 1; i > 0; i--) { const j = rng.draw(i + 1); [distinct[i], distinct[j]] = [distinct[j], distinct[i]]; }
  k++; const jid = `J${String(k).padStart(2, '0')}`;
  const q = it.text.split('\n')[0];
  const opts = distinct.map((a, i) => `  ${'ABCD'[i]}. ${say(it, a)}`).join('\n');
  blocks.push(`**${jid}.** ${q}\n${opts}`);
  key.push({ jid, id: it.id, type: it.type, options: Object.fromEntries(distinct.map((a, i) => ['ABCD'[i], { answer: a, sources: Object.keys(src).filter(s => src[s] === a) }])) });
}
const acts = 'Possible acts: in the field help, chat, take credit (claim someone else\'s work) or argue; in the square chat, praise, share food, interrupt, ignore or argue.';
const prompt = `# Judging villager behaviour

You are judging a small village simulation. Each item below describes a villager at one moment: their personality, beliefs, mood and recent history with another villager. Then it lists two or more possible things the villager does or feels next.

For each option, rate how believable it is for this particular villager in this situation, from 1 (makes no sense for them) to 5 (exactly what I'd expect). Judge each option on its own. Options can get the same score. There is no trick and no single correct answer.

${acts} Rooms: home (eat or rest), field (work), square (socialise). Reactions: what the event means to them (good sign, nothing much, slight, insult) and whether their liking for the other villager goes up, stays the same or goes down.

Reply with this first line:
model: <your model name and version, if you know it>

Then ONLY a CSV in a code block, one row per option, with the header:
item,option,score

${blocks.join('\n\n')}
`;
writeFileSync('pack/exp7_judge_prompt.md', prompt);
writeFileSync('reports/exp7_judge_key.json', JSON.stringify(key, null, 1));
console.log('judge items', key.length, 'options', key.reduce((s, x) => s + Object.keys(x.options).length, 0), 'words', prompt.split(/\s+/).length);
console.log(blocks[0]); console.log(blocks[blocks.length-1]);
