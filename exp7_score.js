// Experiment 7 scoring: agreement between live AI answers, table answers and rule answers.
import { readFileSync, writeFileSync } from 'node:fs';
const items = JSON.parse(readFileSync('reports/exp7_items.json', 'utf8'));
const read = f => Object.fromEntries(readFileSync(f, 'utf8').trim().split(/\r?\n/).slice(1).map(l => { const [id, a, m, lc] = l.split(',').map(s => s.trim()); return [id, a ? a : `${m}/${lc}`]; }));
const live = { opus55: read('fills/exp7/opus55.csv'), gpt6: read('fills/exp7/chatgpt_gpt6.csv') };
const types = ['room', 'act', 'reaction'];
const out = {};
const cmp = (getA, getB) => { const r = { all: [0, 0] }; for (const t of types) r[t] = [0, 0];
  for (const it of items) { const a = getA(it), b = getB(it); const same = a === b; r.all[0] += same; r.all[1]++; r[it.type][0] += same; r[it.type][1]++; } return r; };
const pairs = {
  'table vs rules': [i => i.table, i => i.rules],
  'opus55 vs table': [i => live.opus55[i.id], i => i.table], 'opus55 vs rules': [i => live.opus55[i.id], i => i.rules],
  'gpt6 vs table': [i => live.gpt6[i.id], i => i.table], 'gpt6 vs rules': [i => live.gpt6[i.id], i => i.rules],
  'opus55 vs gpt6': [i => live.opus55[i.id], i => live.gpt6[i.id]],
};
// reactions: also meaning-only agreement
for (const [k, [a, b]] of Object.entries(pairs)) out[k] = cmp(a, b);
const mOnly = (a, b) => cmp(i => (a(i) || '').split('/')[0], i => (b(i) || '').split('/')[0]).reaction;
for (const [k, [a, b]] of Object.entries(pairs)) out[k].reactionMeaningOnly = mOnly(a, b);
for (const [k, r] of Object.entries(out)) console.log(k.padEnd(16), Object.entries(r).map(([t, [s, n]]) => `${t} ${s}/${n}`).join('  '));
console.log('\nper item (id type | table | rules | opus55 | gpt6):');
for (const it of items) console.log(it.id, it.type.padEnd(8), '|', it.table, '|', it.rules, '|', live.opus55[it.id], '|', live.gpt6[it.id]);
writeFileSync('reports/exp7_agreement.json', JSON.stringify({ agreement: out, live }, null, 1));
