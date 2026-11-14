# Village simulation study, prompt R1 of 9: how consistently do AI models fill the tables?

Keep using the engine you built in R0. The rules from R0 still apply: work only from this chat and the attached files, report numbers exactly as your code prints them, and keep the engine's default behaviour unchanged.

## Background

The ten teacher tables (T2–T10, T12; 240 rows) were filled by AI "teacher" models. Each teacher got one message containing every row with its situation already filled in and its answer columns blank. The message described the setting only as "a small farming village" with "believable, ordinary villagers". It did not mention games, simulation or AI. Each teacher replied with the rows as CSV. The two designer tables (T1, T11) are never filled by teachers; always use the rule-table versions of those.

Nine replies are attached, unedited:

| File | Teacher | Setting |
| --- | --- | --- |
| `opusnormal_r1.txt`, `opusnormal_r2.txt` | Claude Opus 5.5 | normal chat, two separate chats |
| `opusblind_r1.txt`, `opusblind_r2.txt` | Claude Opus 5.5 | incognito chat, two separate chats |
| `gemini_r1.txt`, `gemini_r2.txt` | Gemini (free tier) | temporary chat, two separate chats |
| `chatgpt_r1.txt`, `chatgpt_r2.txt` | ChatGPT (free tier) | temporary chat, two separate chats |
| `dev_r1.txt` | Claude Opus 5.5 | the chat in which the engine was designed. It knew the full design, including the rule tables. One run only. |

The first eight are the **blind fills**, in four **arms** of two runs each. `dev_r1` is a separate, informed condition. It is never used to build the consensus.

## What to do

**1. Import and validate.** Turn each reply into a full table set (`tables/<name>/`), using the rule tables for T1 and T11.
- Each data row starts with a row id such as `T2-01`. The table is the part before the dash, followed by the input values and then the answers.
- Allowed clean-up only: trim spaces and surrounding quotes, lower-case, `1` → `+1`, `−1` (any dash) → `-1`, `dont` or `do not` → `don't`.
- Every set must pass A6.0 validation. Report any rows that were missing, illegal or needed clean-up.

**2. Self-consistency.** For each arm, compare run 1 with run 2.
- **Rows identical:** of 240 rows, the share where every answer column matches.
- **Cells identical:** of the 537 answer cells, the share that match.

**3. Agreement between arms.** For each pair of arms, average the rows-identical and cells-identical figures over the four cross pairs (run 1 vs run 1, run 1 vs run 2, and so on).

**4. Agreement across all eight blind fills.** Report:
- rows where all eight are identical;
- rows where at least six of the eight give the identical whole row;
- answer cells (of 537) where all eight agree.

Also, for each table, give the lowest and highest share of rows that a single blind fill shares with the consensus (step 5).

**5. Consensus.** Build a consensus set `tables/consensus/`.
- For each answer cell, take the majority value across the eight blind fills.
- Break ties with the rule-table value if it is among the tied values; otherwise use the first tied value in A3 vocabulary order.
- Report the number of ties, every table hash of the consensus set, and the state and log hash of `runSeed 1, n 20, days 30` with the consensus tables.

**6. Distance from the rule tables.** For each of the nine fills and for the consensus, report the share of rows identical to the rule tables. Also report `dev_r1`'s rows and cells identical to the consensus.

**7. Noise vs temperament.** For each answer cell, look at the four arms' pairs of answers. Classify the cell as:
- **stable:** all eight values are the same;
- **temperament:** at least two arms each agree with themselves but give different values from each other;
- **noise:** neither of the above, so the disagreement comes only from arms disagreeing with themselves.

Report, for each table and answer column, the counts of stable, noise and temperament cells.

**8. Weighting by real use.** Run the village on the consensus tables for seeds 1–20, 20 villagers, 30 days, with the decision log on. Count how often each table row is looked up.
- For T2 and T4, weight the first answer by how often the first option was chosen, and the second answer by how often the second was chosen.
- For every other table, weight each answer cell by the row's total look-ups.

Then report:
- the total number of look-ups and each table's share of them;
- for each of the nine fills, the **share of real decisions where its answer differs from the consensus**: weighted differing cells divided by weighted cells, over the teacher tables;
- for each table and answer column, the usage-weighted chance that a randomly chosen blind fill differs from the consensus.

**9. Two specific rows.** For T6, belief `people are against me` at tier `core`, events `helped` and `apologised to`: list every fill's meaning and pressure.

## Reply format

Plain tables with exact numbers, in the order of the steps above. Then a short list of anything you had to decide that this prompt didn't specify. Add the new folders (`tables/<name>/`, `tables/consensus/`) and your analysis script to the project. Give me an updated zip, `village_R1.zip`.
