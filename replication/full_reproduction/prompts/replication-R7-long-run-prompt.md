# Village simulation study, prompt R7 of 9: does a large village stay alive over a long time?

Keep using the engine and the consensus tables. The same rules apply. Steering is off.

## Design

- 1,000 villagers (castSeed 1, n 1000, so 50 hamlets of 20), 1,000 days, decision log off.
- Consensus tables, seeds 101–105.
- One extra run with the rule tables, seed 101.

## Measures, at the end of every 50th day (day 50, 100, …, 1000)

From the night snapshot and metrics of that day:
- **friendships, feuds, isolates:** as in A12;
- **friends per villager:** the mean number of others each villager likes or is close to;
- **distinct belief combinations:** the number of different (trust, worth, effort) position profiles among the 1,000 villagers, with positions as in R2;
- **distinct trait mixes:** the number of different combinations of the four effective traits;
- **deeply held share:** of all 3,000 belief positions, the share at ±3 (core);
- **positive share:** of all 3,000 positions, the share above zero;
- **share whose beliefs changed:** villagers whose profile differs from the previous checkpoint (at day 50, compare with the start);
- **share whose traits changed:** the same, for the four effective traits;
- **share still as at start:** villagers whose profile equals their profile at day 0;
- **share of likings that changed:** of all directed liking values (each villager toward each other villager in its hamlet), the share that differ from the previous checkpoint. There is no value at day 50.

Summed over the 50 days since the previous checkpoint (including that checkpoint's day):
- **belief changes per villager per 100 days:** applied moves ÷ 1,000 × 2;
- **breaks per 100 days:** applied breaks × 2;
- **unkind share:** from the daily event counts, (argued with + interrupted + ignored + credit taken) ÷ (helped + chatted with + shared food with + argued with + interrupted + praised + ignored + credit taken + apologised to).

Also report the run time per run.

## Reply format

1. A table of the consensus results, as the mean of the 5 seeds, at days 50, 100, 250, 500, 750 and 1000. Columns:
   - belief changes per villager per 100 days;
   - share whose beliefs changed;
   - distinct belief combinations;
   - share of likings that changed;
   - friendships and feuds, each as a % of all 9,500 within-hamlet pairs;
   - isolates;
   - unkind share;
   - deeply held share;
   - share still as at start.
2. The same columns at day 1000 for each consensus seed separately, and for the rule-table run.
3. A chart over time, as a PNG, with four small panels:
   - belief changes per villager per 100 days;
   - share whose beliefs changed;
   - share of likings that changed;
   - friendships and feuds as % of pairs.

Then list any decisions this prompt didn't specify. Add the script and the full series (every checkpoint) to the project, and give me `village_R7.zip`.
