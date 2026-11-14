# Village simulation study, prompt R6 of 9: what happens when an outside mind steers one villager?

Keep using the engine and the consensus tables. The same rules apply.

## Step 1: add a steering option to the engine

Add a configuration field `suture`, default `null`. With `null`, nothing changes, so every fingerprint must stay identical. Rerun `test.js` to confirm. Its value is `{ subjects: [ids], mind, fraction, untilDay }`.

- **Steered days.** At the start of each day (hour 0), with days numbered from 0, decide whether today is steered:
  - steered if `day < untilDay` and `floor((day + 1) × fraction) > floor(day × fraction)`;
  - this spreads the steered days evenly.
- **What the mind controls.** On a steered day, every subject's *choices* use the mind's traits instead of its own effective traits, in exactly these look-ups:
  - T2: diligence, sociability;
  - T3: warmth;
  - T4: honesty;
  - T5: honesty, pride.
- **What stays the subject's own:**
  - its needs, mood, liking and grudges;
  - the T3 liking and mood inputs;
  - its reactions (T6–T10) and beliefs;
  - the night work outcome, which still uses its own diligence;
  - everything about everyone else.
- **Minds:**
  - **cold:** warmth low, sociability low, diligence low, pride high, honesty low.
  - **warm:** warmth high, sociability high, diligence high, pride low, honesty high.
  - **twin:** the subject's own effective traits at the start of the run (after the initial compile), frozen for the whole run.
  - **random:** add a seeded stream `suture` (`fnv1a("<runSeed>:suture")`, used only by this mind). Every time a steered look-up needs traits, draw a fresh personality from it: warmth, sociability, diligence, pride, honesty, in that order, each `levels[draw(3)]`.
    - Draw once per steered T2 look-up and once per steered T5 look-up.
    - For an encounter act, draw once for the T3 warmth and again, separately, for the T4 honesty. When a `pay back` grudge skips T3, only T4 draws.

## Step 2: the experiment

**Design:**
- Consensus tables, 20 villagers, seeds 101–110.
- Every villager takes a turn as the only subject.
- 90 days per run, with `untilDay` 60: steered for 60 days, then released for 30.
- Minds: cold, warm, twin and random. Fractions: 0.25, 0.5, 0.75 and 1.
- Baseline: the same seed with no steering.
- In total, 200 baselines and 3,200 steered runs. The decision log is off.

**For the subject, at the end of day 60 and day 90, in both the steered run and its baseline:**
- its four effective traits (warmth, sociability, diligence, pride) as −1, 0 or +1;
- its belief positions as in R2;
- friends (others it likes or is close to) and enemies (others it dislikes);
- how many others like or are close to it, and how many dislike it;
- its applied belief moves, breaks and flips during days 0–59.

**Report, as mean ± 1.96 × SD / √200 for each mind and fraction:**
- **toward-mind** (cold and warm only): the sum over the four traits of |baseline − mind| minus the sum of |steered − mind|, at day 60 and at day 90. Positive means the villager moved closer to the mind.
- **trait shift and belief shift:** the sum of |steered − baseline| over the four traits, and over the three belief positions, at day 60 and at day 90.
- the change (steered − baseline) in the worth and the trust position at day 60;
- the change in friends and in enemies, at day 60 and at day 90;
- the change in how many others like it, and how many dislike it, at day 60;
- the mean belief moves, breaks and flips, steered and baseline.

## Step 3: why

For no steering, cold, warm and twin, each at fraction 1, run seeds 101–105 for 60 days with the logs on, with every villager taking a turn as subject. Per subject per run, report:
- its T2 choices by room (home, field, square);
- how many times it received `praised`;
- how many times it received `credit taken`.

Average over subjects and seeds.

## Step 4: one life

For villager n0017, seed 101: run once without steering and once with the cold mind at fraction 1. For each run, report at days 0, 30, 60 and 90:
- its three beliefs with their tiers;
- its four effective traits;
- its friends and enemies;
- how many others like it.

## Reply format

The Step 2 table, with one row per mind and fraction. Then the Step 3 and Step 4 tables, and any decisions this prompt didn't specify. Add the scripts to the project, and give me `village_R6.zip`.
