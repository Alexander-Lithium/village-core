// Experiment 5 (export numbering): sensitivity. Vary each arbitrary constant one at a time and check whether the three main
// conclusions of Experiment 3 still hold:
//  C1 the belief loop makes villagers' social lives more varied (SD of friends: loop on > loop off)
//  C2 the belief loop makes the village kinder (friendships on > off, feuds on < off)
//  C3 shuffled tables give a far less kind village than the real tables (unkind share shuffled > 2x consensus)
// Consensus tables, seeds 101-130, 60 days.
import { writeFileSync } from 'node:fs';
import { readSet, runOne, summarise } from './exp3_spread_of_lives.js';

const SEEDS = Array.from({ length: 30 }, (_, i) => 101 + i);
const tables = readSet('consensus_blind8');
const VARIANTS = {
  'spec defaults': {},
  'backup choice 15%': { pSecond: 15 }, 'backup choice 35%': { pSecond: 35 },
  'liking step 2': { likingStep: 2 }, 'liking step 4': { likingStep: 4 },
  'evidence window 5 days': { bufferDays: 5 }, 'evidence window 10 days': { bufferDays: 10 },
  'evidence thresholds looser': { balAgainst: -1, balFor: 1, balStrong: 4 }, 'evidence thresholds stricter': { balAgainst: -3, balFor: 3, balStrong: 6 },
  'hunger 4/hour': { foodPerTick: 4 }, 'hunger 6/hour': { foodPerTick: 6 },
};
const rows = [];
for (const [name, cfg] of Object.entries(VARIANTS)) {
  const on = summarise(SEEDS.map(s => runOne(tables, { ...cfg, runSeed: s })));
  const off = summarise(SEEDS.map(s => runOne(tables, { ...cfg, runSeed: s, loopOff: true })));
  const sh = summarise(SEEDS.map(s => runOne(tables, { ...cfg, runSeed: s, tablesMode: 'shuffled' })));
  const r = {
    variant: name,
    friendsSD_on: on.spread.friendsSD.value, friendsSD_off: off.spread.friendsSD.value,
    friend_on: on.village.friendships.mean, friend_off: off.village.friendships.mean,
    feud_on: on.village.feuds.mean, feud_off: off.village.feuds.mean,
    unkind_cons: on.village.negShare.mean, unkind_shuf: sh.village.negShare.mean,
  };
  r.C1 = r.friendsSD_on > r.friendsSD_off; r.C2 = r.friend_on > r.friend_off && r.feud_on < r.feud_off; r.C3 = r.unkind_shuf > 2 * r.unkind_cons;
  rows.push(r);
  process.stderr.write(name + ' done\n');
}
const f = (x, d = 1) => x.toFixed(d);
console.log('variant'.padEnd(30), 'SD friends on/off'.padEnd(19), 'friendships on/off'.padEnd(20), 'feuds on/off'.padEnd(14), 'unkind cons/shuf'.padEnd(18), 'C1 C2 C3');
for (const r of rows) console.log(r.variant.padEnd(30), `${f(r.friendsSD_on, 2)} / ${f(r.friendsSD_off, 2)}`.padEnd(19), `${f(r.friend_on)} / ${f(r.friend_off)}`.padEnd(20),
  `${f(r.feud_on)} / ${f(r.feud_off)}`.padEnd(14), `${f(100 * r.unkind_cons)}% / ${f(100 * r.unkind_shuf)}%`.padEnd(18), [r.C1, r.C2, r.C3].map(x => (x ? 'yes' : 'NO ')).join(' '));
writeFileSync('reports/exp8.json', JSON.stringify(rows, null, 1));
