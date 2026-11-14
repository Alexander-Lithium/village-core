# Village simulation study, prompt R3 of 9: can a designer change one rule and see why?

Keep using the engine and the consensus tables from R1. The same rules apply.

## Part A: decision traces

Run the consensus tables with seed 101, 20 villagers, 60 days, decision and event logs on. Find the first three encounters where the receiver took the act as an `insult`. For each one, list every decision-log line for the initiator and the receiver at that tick, in order. Show it as a readable trace: who, which table, the inputs, the output, and whether the first or second option was used. Then describe in one or two plain sentences what happened and why.

## Part B: one-row edit

**The edit:** in consensus table T4, change the row `friendly, field, low` honesty from first `help`, second `take credit` to first `help`, second `chat`. Change nothing else. In words: a friendly but dishonest villager no longer sometimes takes credit for a friend's work.

**Design:** 50 paired runs, with seeds 101–150, 20 villagers and 60 days. For each seed, run once with the original consensus tables and once with the edited tables.

**Measures, per run:**
- **targeted uses:** T4 look-ups of that row where the second option was chosen;
- **credit-taking events:** event-log rows whose event is `credit taken`;
- **unkind-act share:** as in R2, acts chosen by an initiator, excluding apologies and night work. The share is the `argue`, `interrupt`, `ignore` and `take credit` acts over all those acts;
- **belief changes:** applied moves summed over all days;
- **friendships** and **feuds** on the last day;
- **field hours:** T2 look-ups whose chosen option was `field`;
- **days worked:** night work events, whether well or badly;
- **share of good work days:** `work went well` divided by days worked;
- **hunger events:** T1 look-ups that returned `eat` or `eat now`.

**Report, for each measure:**
- the mean before and after;
- the paired change: the mean of (edited − original) ± 1.96 × SD of the differences / √50;
- the seed-to-seed SD of the original runs;
- the change divided by that SD.

## Reply format

The traces, then one table for Part B. Then list any decisions this prompt didn't specify. Add the script to the project, and give me `village_R3.zip`.
