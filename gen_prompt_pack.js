// Writes the blind teacher prompt pack: pack/paste1.md, paste2.md, paste3.md.
// Rows are generated from the engine's table grids, so the pack always matches the engine.
import { writeFileSync, mkdirSync } from 'node:fs';
import { TABLE_BY_ID, grid } from './engine.js';

export const PASTES = [
  ['T2', 'T3', 'T5', 'T10'],
  ['T4', 'T6', 'T8'],
  ['T7', 'T9', 'T12'],
];

const INTRO = (k) => `# Part ${k} of 3

You are helping write reference tables that describe how ordinary people in a small farming village typically behave and react.

Picture believable, ordinary villagers: a realistic mix of kind and unkind, proud and humble, honest and dishonest, with everyday flaws included. Don't make everyone nice, and don't turn anyone into a caricature. Each row is one situation; answer for a typical person who matches that row.

**The village.** Everyone lives alone. People work in a shared **field** and meet others in the village **square**; at **home** they eat and rest. A day has 16 waking hours.

**How to reply**
- Reply with CSV code blocks only, one per table, in the order given. No commentary before, between or after them.
- Keep every row, its \`row_id\` and every filled-in column exactly as given. Fill in only the empty columns.
- Use only the allowed words for each column, spelled exactly as shown (lowercase).
`;

const TRAITS = `**Personal traits** (each is \`low\`, \`mid\` or \`high\`)
- **warmth:** kindness and goodwill toward others.
- **sociability:** how much they enjoy company.
- **diligence:** how hard and steadily they work.
- **honesty:** how truthful and fair they are.
- **pride:** sense of their own importance and status.
`;

const BELIEFS = `**Beliefs and how strongly they're held** (\`tier\`)
- \`faint\`: a passing thought they're not sure of.
- \`held\`: a settled view.
- \`core\`: part of who they are.
`;

const APPRAISAL = `**What to fill in**
- **meaning:** how they take it: \`good sign\`, \`nothing much\`, \`slight\` (a minor offence), \`insult\` (a real offence).
- **pressure:** what this experience does to the belief shown in the row. For \`faint\` or \`held\` beliefs use \`stronger\` (it confirms the belief, so they hold it more firmly), \`same\` (no effect), or \`weaker\` (it makes them doubt it). For \`core\` beliefs use only \`same\` or \`strained\` (it shakes a deeply held belief); a core belief can't get stronger.
`;

const EVENTS = {
  'helped': 'someone helped them with their work',
  'chatted with': 'someone made small talk with them',
  'shared food with': 'someone shared food with them',
  'argued with': 'someone argued with them',
  'interrupted': 'someone interrupted them',
  'apologised to': 'someone apologised to them for an earlier unkindness',
  'praised': 'someone praised them',
  'ignored': 'someone ignored them',
  'credit taken': 'someone took credit for their work',
  'work went well': 'their own day of work in the field went well',
  'work went badly': 'their own day of work in the field went badly',
};
const eventList = ids => ids.map(e => `- \`${e}\`: ${EVENTS[e]}.`).join('\n');

const DESC = {
  T2: () => `## Table: action
Where does a villager choose to spend the next hour?
- **need:** \`none\` (feeling fine), \`eat\` (getting hungry), \`rest\` (getting tired).
- **diligence**, **sociability:** see traits.
- **first:** where they most likely go: \`home\` (eat or rest), \`field\` (work), \`square\` (socialise).
- **second:** where they'd go instead about one time in four. It may be the same as first.`,
  T3: () => `## Table: stance
A villager meets another villager. How do they feel toward that person right now?
- **warmth:** their general kindness (see traits).
- **liking:** how they feel about this particular person: \`dislike\`, \`neutral\`, \`like\`, \`close\`.
- **mood:** their mood right now: \`low\`, \`calm\`, \`good\`.
- **stance:** \`friendly\`, \`neutral\`, \`cold\`, \`hostile\`.`,
  T5: () => `## Table: apology
Earlier, a villager was unkind to someone (argued with them, interrupted them, ignored them, or took credit for their work). Now they meet that person again. Do they apologise?
- **honesty**, **pride:** see traits.
- **decision:** \`apologise\` or \`don't\`.`,
  T10: () => `## Table: grudge
Someone upset a villager. How do they respond toward that person?
- **warmth:** the upset villager's general kindness.
- **offence:** \`slight\` (minor) or \`insult\` (serious).
- **apology:** \`none\` (no apology yet) or \`received\` (the person has just apologised).
- **response:** \`let it go\` (no hard feelings), \`cool off\` (a bit distant for the rest of the day), \`hold grudge\` (stay distant until they apologise), \`pay back\` (be hostile the next time they meet).`,
  T4: () => `## Table: act
A villager meets someone. Given how they feel toward that person (stance), where they are, and their honesty, what do they do?
- **stance:** \`friendly\`, \`neutral\`, \`cold\`, \`hostile\`.
- **room:** \`field\` (at work) or \`square\` (in the village square).
- **honesty:** see traits.
- Allowed acts in the **field:** \`help\` (help with their work), \`chat\`, \`take credit\` (take credit for the other's work), \`argue\`.
- Allowed acts in the **square:** \`chat\`, \`praise\`, \`share food\`, \`interrupt\`, \`ignore\`, \`argue\`.
- **first:** what they most likely do. **second:** what they'd do instead about one time in four (may be the same as first). Use only acts allowed in that room.`,
  T6: () => `## Table: reaction (trust)
Something just happened to a villager involving another person. The villager holds the belief shown, at the strength shown. How do they take it?
${eventList(['helped', 'chatted with', 'shared food with', 'argued with', 'interrupted', 'apologised to'])}
- **belief:** \`people mean well\` or \`people are against me\`.
- **liking_change:** how they now feel toward the person involved: \`up\`, \`same\`, \`down\`.`,
  T8: () => `## Table: reaction (work)
At the end of the day, a villager learns how their own work went. They hold the belief shown, at the strength shown. How do they take it?
${eventList(['work went well', 'work went badly'])}
- **belief:** \`hard work pays off\` or \`nothing i do matters\`.`,
  T7: () => `## Table: reaction (status)
Something just happened to a villager involving another person. The villager holds the belief shown, at the strength shown, and has the pride shown. How do they take it?
${eventList(['praised', 'ignored', 'credit taken'])}
- **belief:** \`i am respected\` or \`i am overlooked\`.
- **pride:** see traits.
- **liking_change:** how they now feel toward the person involved: \`up\`, \`same\`, \`down\`.`,
  T9: () => `## Table: mood
A villager is in the mood shown, and something just happened that they took as shown (meaning). What is their mood now?
- **mood:** \`low\`, \`calm\`, \`good\`.
- **meaning:** \`good sign\`, \`nothing much\`, \`slight\`, \`insult\`.
- **new_mood:** \`low\`, \`calm\`, \`good\`.`,
  T12: () => `## Table: belief and behaviour
A villager holds the belief shown, at the strength shown. Compared with their natural temperament, how does this belief shift their everyday behaviour?
- For each of **warmth**, **sociability**, **diligence**, **pride**: \`-1\` (less), \`0\` (no change), \`+1\` (more).
- Beliefs: \`people mean well\`, \`people are against me\`, \`i am respected\`, \`i am overlooked\`, \`hard work pays off\`, \`nothing i do matters\`.`,
};

export function packRows(tid) {
  const t = TABLE_BY_ID[tid];
  return grid(t).map((inp, i) => [`${tid}-${String(i + 1).padStart(2, '0')}`, ...inp]);
}
export function packHeader(tid) {
  const t = TABLE_BY_ID[tid];
  return ['row_id', ...t.inputs.map(c => c[0]), ...t.outputs.map(c => c[0])].join(',');
}

export function buildPaste(k) {
  const tids = PASTES[k - 1];
  let s = INTRO(k) + '\n';
  const needTraits = tids.some(t => ['T2', 'T3', 'T4', 'T5', 'T7', 'T10'].includes(t));
  const needBeliefs = tids.some(t => ['T6', 'T7', 'T8', 'T12'].includes(t));
  const needAppraisal = tids.some(t => ['T6', 'T7', 'T8'].includes(t));
  if (needTraits) s += '\n' + TRAITS;
  if (needBeliefs) s += '\n' + BELIEFS;
  if (needAppraisal) s += '\n' + APPRAISAL;
  for (const tid of tids) {
    const t = TABLE_BY_ID[tid];
    const blanks = ','.repeat(t.outputs.length);
    s += '\n' + DESC[tid]() + '\n\n```csv\n' + packHeader(tid) + '\n' + packRows(tid).map(r => r.join(',') + blanks).join('\n') + '\n```\n';
  }
  return s;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  mkdirSync('pack', { recursive: true });
  let total = 0;
  for (let k = 1; k <= 3; k++) {
    const txt = buildPaste(k);
    writeFileSync(`pack/paste${k}.md`, txt);
    const rows = PASTES[k - 1].reduce((a, t) => a + packRows(t).length, 0);
    total += rows;
    console.log(`pack/paste${k}.md: ${PASTES[k - 1].join(', ')} — ${rows} rows, ${txt.split(/\s+/).length} words`);
  }
  console.log('Total teacher rows:', total);
}

// Single-message version: all 10 tables, one reply as one CSV block.
export function buildSingle() {
  const order = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T12'];
  let s = `You are helping write reference tables that describe how ordinary people in a small farming village typically behave and react.

Picture believable, ordinary villagers: a realistic mix of kind and unkind, proud and humble, honest and dishonest, with everyday flaws included. Don't make everyone nice, and don't turn anyone into a caricature. Each row is one situation; answer for a typical person who matches that row.

**The village.** Everyone lives alone. People work in a shared **field** and meet others in the village **square**; at **home** they eat and rest. A day has 16 waking hours.

**How to reply**
- Start your reply with one plain line, before the code block: \`model: <your model name and version, as far as you know it>\`.
- Then reply with **one single CSV code block** containing all ten tables below, in the order given. Keep each table's header line directly above its rows.
- Keep every row, its \`row_id\` and every filled-in column exactly as given. Fill in only the empty columns.
- Use only the allowed words for each column, spelled exactly as shown (lowercase).
- No other commentary before or after the code block.
- If your reply is cut off, continue in your next message from the next unfinished row, inside a new CSV code block.

` + TRAITS + '\n' + BELIEFS + '\n' + APPRAISAL;
  for (const tid of order) {
    const t = TABLE_BY_ID[tid];
    const blanks = ','.repeat(t.outputs.length);
    s += '\n' + DESC[tid]() + '\n\n```csv\n' + packHeader(tid) + '\n' + packRows(tid).map(r => r.join(',') + blanks).join('\n') + '\n```\n';
  }
  return s;
}
if (import.meta.url === `file://${process.argv[1]}` && process.argv[2] === 'single') {
  writeFileSync('pack/single.md', buildSingle());
  console.log('pack/single.md written');
}
