# Village simulation study, prompt R4 of 9: do the conclusions depend on arbitrary settings?

Keep using the engine and the consensus tables. The same rules apply.

## Step 1: expose eight settings as configuration

Add these configuration fields. Each default equals the value fixed in the specification, so with defaults **every fingerprint must stay unchanged**. Rerun `test.js` to confirm.

| Field | Default | Meaning |
| --- | --- | --- |
| `pSecond` | 25 | already exists: chance (out of 100) of using a table's second option |
| `likingStep` | 3 | the liking counter rule (A10.7): counter ≥ +likingStep → liking up; ≤ −likingStep → down |
| `foodPerTick` | 5 | food lost per waking tick (A10 step 1) |
| `mealSize` | 40 | food gained when eating at home (A10 step 4) |
| `bufferDays` | 7 | the maximum length of each evidence buffer (A11.2) |
| `balAgainst` | −2 | balance ≤ balAgainst → `mostly against` |
| `balFor` | 2 | balAgainst < balance < balFor → `mixed`; balFor ≤ balance < balStrong → `mostly for` |
| `balStrong` | 5 | balance ≥ balStrong → `strongly for` |

## Step 2: the test

Three conclusions from the main results are tested under each setting:
- **C1:** the belief loop makes villagers' social lives more varied. The SD of friends (from R2) is higher with the loop on than with it off.
- **C2:** the belief loop changes the village. There are more friendships *and* fewer feuds with the loop on than off.
- **C3:** the real tables are far kinder than shuffled ones. The unkind-act share with shuffled tables is more than twice the share with the consensus tables.

**Variants:** change one thing at a time from the defaults.

| Variant | Change |
| --- | --- |
| spec defaults | none |
| backup choice 15% / 35% | pSecond 15 / 35 |
| liking step 2 / 4 | likingStep 2 / 4 |
| evidence window 5 / 10 days | bufferDays 5 / 10 |
| evidence thresholds looser | balAgainst −1, balFor 1, balStrong 4 |
| evidence thresholds stricter | balAgainst −3, balFor 3, balStrong 6 |
| hunger 4 / 6 per hour | foodPerTick 4 / 6 |

That is 11 variants. For each, use the consensus tables, 20 villagers, 60 days and **seeds 101–130** (30 seeds), and run three conditions:
- loop on;
- loop off;
- loop on with shuffled tables.

Use the R2 definitions for the SD of friends (per villager across seeds, sample SD, averaged over villagers), friendships, feuds (last day) and the unkind-act share.

## Reply format

One table with a row per variant and these columns:
- SD of friends, loop on / off;
- friendships on / off;
- feuds on / off;
- unkind-act share, consensus / shuffled;
- C1, C2 and C3, each as yes or no.

Then list any decisions this prompt didn't specify. Add the script to the project, and give me `village_R4.zip`.
