# Village simulation study, prompt R2 of 9: do villagers live different lives, and why?

Keep using the engine and the table sets from R0 and R1. The same rules apply: work only from this chat, report numbers exactly as printed, and keep default behaviour unchanged.

## Design

Every condition uses the same 20 villagers (castSeed 1, n 20), run on **seeds 101–150** (50 runs), for **60 days**, with the decision and event logs on.

| Condition | Tables | Setting |
| --- | --- | --- |
| consensus | `tables/consensus` | defaults |
| consensus, loop off | consensus | loopOff |
| consensus, traits off | consensus | traitsOff |
| consensus, shuffled tables | consensus | tablesMode shuffled |
| consensus, random tables | consensus | tablesMode random |
| rule tables | `tables/rules` | defaults |
| each of the nine fills | `tables/<fill>` | defaults (one condition per fill) |

That is 15 conditions in total.

## Measures

**Per run (village outcomes), at the end of day 60:**
- **friendships, feuds and isolates,** as defined in A12, from the last day's metrics;
- **belief moves:** applied up, down, flip and break moves, summed over all 60 days;
- **breaks:** applied breaks, summed over all 60 days;
- **flips:** applied flips, summed over all 60 days;
- **unkind-act share:** from the event log, count every act chosen by an initiator, excluding apologies and night work outcomes. The share is the acts that are `argue`, `interrupt`, `ignore` or `take credit`, divided by all those acts.

For each condition, report the mean ± 95% CI (1.96 × SD / √50), the SD, the minimum and the maximum over the 50 seeds.

**Per villager, across the 50 seeds (spread of lives).** For each villager, record at the end of each run:
- its belief positions as three numbers (trust, worth, effort), each from −3 to +3: positive pole = +(tier + 1), negative pole = −(tier + 1);
- its friends: how many other villagers it likes or is close to;
- its unkind-act share as an initiator.

Then compute, for each villager:
- **belief distance:** the mean, over all pairs of seeds, of the sum of absolute differences between the two runs' three positions;
- **distinct endings:** the number of different three-position profiles across the 50 runs;
- **SD of friends** across the 50 runs, using the sample SD (n − 1);
- **SD of unkind-act share** across the 50 runs.

Average each over the 20 villagers. For belief distance, SD of friends and SD of unkind-act share, give a 95% bootstrap interval: resample the 50 seeds with replacement 200 times and recompute.

## Reply format

Two tables, each with one row per condition:
1. spread of lives: belief distance [CI], distinct endings (of 50), SD friends [CI], SD unkind-act share [CI];
2. village outcomes: friendships, feuds, isolates, belief moves, breaks, flips and unkind-act share, each as mean ± CI.

Then list any decisions you made that this prompt didn't specify. Add the script and its raw per-run results to the project, and give me `village_R2.zip`.
