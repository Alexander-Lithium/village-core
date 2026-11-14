# Village Core v1.0

A small, deterministic, agent-based village simulation built to the v1.0 build specification. It has no dependencies and runs in Node ≥ 18 and in modern browsers.

## How to run

```
node gen_cast.js          # cast/cast_s1_n20.csv
node gen_rule_tables.js   # tables/rules/T1..T12 (normalised form) + hashes
node test.js              # acceptance tests + golden hashes
node build_viewer.js      # viewer.html (self-contained, open in a browser)

node run.js --runSeed 1 --n 20 --days 30 --tableDir tables/rules --out results/base
node run.js --n 20 --days 30 --loopOff --out results/loopoff
node run.js --n 20 --days 30 --tablesMode shuffled --seeds 1-100 --out results/shuffled
```

`run.js` flags are `--runSeed --castSeed --n --days --hamletSize --pSecond --tableDir --tablesMode --loopOff --traitsOff --noLog --seeds a-b --out`.

A teacher table set is a new directory under `tables/` that contains all twelve files, with the designer tables T1 and T11 copied in. `build_viewer.js` picks up every directory under `tables/` as a table set.

## File formats

- **Tables** (`tables/<set>/Tn_*.csv`): the headers are exactly as in A6.0b. The input columns come first, then the output columns. There is no quoting. The hash is taken over the normalised text: the header, then the rows sorted by key, each line ending in `\n`.
- **Cast** (`cast/*.csv`): `id,warmth,sociability,diligence,honesty,pride,flexibility,trust_pole,trust_tier,worth_pole,worth_tier,effort_pole,effort_tier`.
- **decision_log.csv**: `tick,npc,table,key,output,choice`. One line per lookup, in the order the lookups happen. The tick column is a number, `night<day>` or `start`.
- **event_log.csv**: `tick,room,initiator,receiver,act,event,meaning,pressure,likingChange`.
- **summary.json**:
  - the config, the cast hash and the table hashes;
  - `missingRows` {count, keys};
  - `stateHash`, `logHash` and `maxStarvingStreak`;
  - `days`, one metrics object per day: event counts, moods at the end of hour 15, belief-position counts (`m3…p3`), moves, friendships, feuds and isolates;
  - `timing`.
- **snapshots.json**: `{initial, days:[{day, npcs:[{id,trust,worth,effort,eff,mood}], moves:[...]}]}`.
- **final_metrics.csv** (with `--seeds`): one row per seed, holding the last day's metrics and the total moves.

## Builder decisions

1. I added `package.json` with `"type":"module"` so that Node 18 loads the `.js` files as ES modules.
2. NPC ids are zero-padded to `max(4, digits of n)`. Ids are `n0001…` for n ≤ 9999 and `n00001…n10000` for n = 10000, so string order always equals numeric order.
3. Each numbered step of A10 is a full pass over all NPCs, in id order, before the next step starts. For example, every T1 lookup happens before any T2 lookup. This fixes the order of the decision log.
4. The two-option draw (T2 from `room`, T4 from `act`) is always consumed, even when `first` equals `second`.
5. In A10.6 the bullets run in the order listed: pressure, then mood (T9), then the liking change, then offence and grudge. The liking change uses R's grudge as it stood *before* this event updated it.
6. Night work outcomes have no initiator. In the event log their room, initiator, act and likingChange are `-`.
7. An apology encounter is logged in the event log with act `apology`.
8. The event log's `likingChange` column holds the table output (`up`/`same`/`down`), not the delta after grudge adjustments.
9. Moves count toward "moves by type" and the snapshot move list only if they changed the belief. A `stay` move, or a move that doesn't apply, is not counted.
10. With castSeed 1 and n ≤ 20, the cast is the first n rows of `cast/cast_s1_n20.csv`. Otherwise the engine generates it. The two give identical rows. The cast hash is taken over the header plus the rows actually used.
11. `missingRows` = {count of fallback lookups, distinct `Tn:key` strings in the order first seen}.
12. The table hashes in the summary are computed after the `tablesMode` transform, so they describe the tables actually used. In `csv` mode they equal the hashes of the loaded tables.
13. The `shuffle` and `random` streams are seeded from the run seed and consumed before tick 0.
14. Validation also checks the header. A row whose input value is not in the vocabulary is reported as an extra row.
15. The CSV reader strips a BOM and `\r` and ignores blank lines.
16. The starving streak is measured at step 2, after the body update. It carries across nights, which have no waking ticks.
17. Per-NPC snapshots are kept when `logDecisions` is on or n ≤ 200. Daily metrics are always kept.
18. `msPerTick` = time spent stepping (night steps included) ÷ waking ticks, measured with `performance.now()`. Setup time is reported separately.
19. Daily event counts include `apologised to` and the work outcomes.
20. An isolate is an NPC with no `like`/`close` relationship in either direction.
21. In the viewer, the decision log is on for n ≤ 200 and off above that. The n options are 5, 20, 1000 and 10000. The dots are hidden for n > 200. Step runs one waking tick, and the night runs automatically after hour 15. Changing a setting discards the current run.
22. Test 7 deletes the T3 row `mid,neutral,calm`. Its default (`neutral`) happens to equal the rule output, so the test checks the fallback through `missingRows` and through a log line for that key with the default output.
23. Test 4 changes the T4 row `neutral,square,mid` to `argue/interrupt` and compares the (tick, room, initiator, receiver) tuples for day 1.
24. Test 0, a SHA-256 known-vector check, is added in front of the specified tests.

## Golden hashes

Not yet recorded. This build was written without running code. Run `node test.js` and paste its "Golden hashes" block here:

```
runSeed 1, n 20, days 30   state <paste>   log <paste>
runSeed 1, n 5,  days 3    state <paste>   log <paste>
```
