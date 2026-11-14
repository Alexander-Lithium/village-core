# Experimental results export (v9)

**Version:** v5 (2026-11-13)
**Versioning:** each update adds or revises an experiment and increases the version number (v2, v3, …). Experiments are numbered in the order they were added. Each has its own Methods, Results and Interpretation.

| Version | Date | Change |
| --- | --- | --- |
| v1 | 2026-11-13 | Added Experiment 1 (engine replication from a written specification). |
| v2 | 2026-11-13 | Added Experiment 2 (consistency of LLM-filled lookup tables across models, runs and context). |
| v3 | 2026-11-13 | Experiment 2: added the noise vs temperament breakdown and usage-weighted disagreement. |
| v4 | 2026-11-13 | Added Experiments 3 (spread of lives, controls, teacher culture), 4 (decision traces and one-row edit) and 5 (sensitivity). Revised one Experiment 2 interpretation point in light of Experiment 3. |
| v5 | 2026-11-13 | Added Experiment 6 (speed on consumer devices, cost compared with a live LLM, consumer plan usage, acquaintance circle size). |
| v6–v8 | 2026-11-13 | Added Experiments 7 (tables vs live AI, blind judging) and 8 (the suture). |
| v9 | 2026-11-14 | Added Experiment 9 (long run), added after AI-mediated reviewer analysis of the draft paper. |

---

## Experiment 1: Reproducing the engine from a written specification

### Methods

**Aim.** To test whether the simulation engine can be rebuilt by an independent party from a written specification alone, and whether the rebuilt engine produces exactly the same simulations.

**Specification.** A single written build specification (about 4,300 words) describes the reference village completely:
- the vocabulary of words villagers use;
- the twelve lookup tables and their formats;
- the order of every step in an in-game hour and at night;
- the random-number method;
- the starting cast of villagers;
- the output files and acceptance tests.

It includes a baseline set of hand-written rule tables, so a build can run without any LLM-filled tables. The specification was pasted as the only input; no code was shared.

**Builds.**
- **Reference build:** Claude Opus 5.5, in the working session that wrote the specification (with full project context). The build was run and checked against its acceptance tests.
- **Independent build:** Claude Opus 5.5 (medium effort), in a new incognito chat with no project context, memory or prior conversation. The specification was pasted unchanged. This session could not execute code, so it returned source files without running them. The operator saved these files exactly as given and ran them without modification.

**Comparison.** Both builds were run with the same settings. Two fingerprints were compared for each run:
- **State fingerprint:** a hash (SHA-256) of every villager's complete final state: body, mood, location, beliefs, personality, recent evidence, and every relationship.
- **Decision fingerprint:** a hash of the full, ordered log of every table lookup made during the run.

Identical fingerprints mean identical final villages reached through the identical sequence of decisions.

**Runs compared.**
- The two reference runs named in the specification: 20 villagers for 30 days, and 5 villagers for 3 days.
- Six further runs not named in the specification: a longer run (60 days, different seed), the belief loop switched off, personality traits switched off, shuffled tables, random tables, and 100 villagers across 5 hamlets.
- A scale run: 10,000 villagers for 1 day.

The generated starting cast and the twelve baseline tables were also compared file by file.

**To reproduce.** Paste `village-core-v1-build-prompt.md` (specification v1.0.1) unchanged into a fresh session, run the resulting acceptance tests, and compare the printed reference fingerprints with those below.

### Results

| Comparison | Outcome |
| --- | --- |
| Independent build's own acceptance tests | All passed (12 of 12) |
| Starting cast | Identical |
| Twelve baseline tables | Identical |
| 20 villagers, 30 days (reference run) | State and decision fingerprints identical |
| 5 villagers, 3 days (reference run) | State and decision fingerprints identical |
| 60-day run, different seed | Identical |
| Belief loop off | Identical |
| Traits off | Identical |
| Shuffled tables | Identical |
| Random tables | Identical |
| 100 villagers, 5 hamlets | Identical |
| 10,000 villagers | Different in specification v1.0; identical after a one-sentence clarification (v1.0.1) |

- The 20-villager, 30-day reference run involves over 63,000 table lookups. Every one occurred in the same order in both builds.
- Reference fingerprints (castSeed 1, rule tables), unchanged by the clarification:
  - 20 villagers, 30 days: state `f64386a9…a76d75`, decisions `7b862fb6…18d48d9`
  - 5 villagers, 3 days: state `7ae5d3c7…2b06fa1c`, decisions `40733d27…7bc96b204`
- **The single divergence:** specification v1.0 named villagers "n0001, n0002, …" but did not say what villager 10,000 is called, or whether villagers are ordered alphabetically or numerically. The two builds resolved this differently. The independent builder had flagged the ambiguity in its own notes before anything was run. The specification was clarified in one sentence (4-digit names, always numeric order). Once both builds followed it, the 10,000-villager runs matched. No run under 10,000 villagers was affected.
- Run time for 10,000 villagers was about 22 ms per in-game hour on the test machine, in both builds.

### Interpretation (for discussion)

- A written specification alone was enough for an independent session, with no access to the reference code, to rebuild the engine bit-for-bit. The specification, not the code, is therefore the method of record, and the paper can be reproduced by anyone with the specification.
- The independent build was written **without running any code**. It matched on the first attempt, so the result reflects the precision of the specification, not trial and error.
- Exact matching goes beyond approximate agreement. Every decision of every villager agreed. This is possible only because every behavioural choice in the engine is a table lookup or a written rule, with all randomness drawn from seeded streams.
- The fingerprint comparison found the one ambiguity in the specification immediately and showed where it was. This doubles as a practical check for future versions: any change to the specification can be verified the same way.
- Determinism has practical value beyond the paper. The same tables and seed always produce the same village, so behaviour can be audited, bugs replayed, and a change to one table row isolated (separate random streams keep who-meets-whom unaffected by changes in what people do).
- Scope: this experiment shows that the **engine** is reproducible. It doesn't test whether **LLM-filled tables** are consistent across models and runs; that is a separate experiment. Table consistency matters more for the engine's practical claims (cost, trust in a game's characters), while build reproducibility matters for the paper.
- Both builds used the same model (Claude Opus 5.5). A build by a different provider's model was not attempted, because the aim was reproducibility of the paper rather than comparison of model coding ability.
- Limitations: one independent build; tested with the hand-written baseline tables; the 10,000-villager result depends on the v1.0.1 clarification.


---

## Experiment 2: Consistency of LLM-filled lookup tables

### Methods

**Aim.** To measure how consistently large language models fill the engine's lookup tables: between repeat runs of the same model, between different models, and depending on how much the model knows about the project.

**Tables.** The ten psychology tables of the reference village (240 rows in total) were filled by "teacher" models. Each row is one situation described in words: for example, "a low-warmth villager who dislikes this person and is in a low mood meets them". The teacher chooses the response from a fixed list of allowed words (for example `friendly`, `neutral`, `cold`, `hostile`). The tables cover:
- where to spend the hour;
- stance toward another villager;
- what to do (two choices: the most likely and a less likely one);
- whether to apologise;
- how events are taken, against three belief pairs (trust, status, work);
- mood change;
- grudges;
- how each belief shifts everyday behaviour.

Two designer tables (needs and belief change) are fixed by the specification and were not filled.

**Prompt.** One message containing all ten tables, every row pre-filled with its situation and blank answer columns. It describes the setting only as "a small farming village" and asks for "believable, ordinary villagers … with everyday flaws included". It defines every allowed word, states the rules for how strongly held beliefs can change, and asks for the reply as a single CSV block. It contains no project names, hypotheses, or mention of simulation, games or AI agents. Run 2 added one line asking the model to state its name and version first. Prompt text: `teacher-pack-single.md`.

**Teacher arms (context gradient).**

| Arm | Model and setting | What the model knew | Runs |
| --- | --- | --- | --- |
| Dev chat | Claude Opus 5.5 (Pro), the working session that designed the engine and wrote hand-written rule tables for every table | Everything, including an "answer key" (the rule tables) | 1 |
| Normal chat | Claude Opus 5.5 (Pro, medium effort), new ordinary chat outside the project | Whatever account-level memory and settings carry | 2 |
| Incognito | Claude Opus 5.5 (Pro, medium effort), incognito chat | Nothing | 2 |
| Gemini | Gemini, free tier, Temporary Chat, model set to Auto, low thinking (self-reported as Gemini 2.5 Pro in run 2) | Nothing | 2 |
| ChatGPT | ChatGPT, free account, Temporary Chat (self-reported as GPT-6 in run 2) | Nothing | 2 |

- Each run was a new chat.
- The dev-chat fill was completed and sealed with a timestamped cryptographic hash before any other fill was returned. A second dev run was not possible, because it would not be independent of the first.
- Model self-reports are unverified.

**Processing.** Replies were imported automatically and checked for completeness and allowed words. The only normalisation was letter case, quotation marks and writing `1` as `+1`.

**Measures.**
- **Row agreement:** the percentage of rows where two fills give identical answers in every column. Cell agreement (column by column) is also reported.
- **Self-consistency:** run 1 vs run 2 of the same arm.
- **Consensus:** the majority answer per column across the eight blind fills (all arms except the dev chat). Ties were broken toward the rule-table answer if it was among the tied options, otherwise toward the first allowed word.
- **Agreement with the rule tables:** how close each fill is to the developer's hand-written answer key.

**Noise vs temperament, weighted by use (added in v3).** Each answer cell was classed by how the eight blind fills behaved:
- **stable:** all eight fills give the same answer;
- **noise:** at least one model gives different answers in its two runs, and no model is consistently different;
- **temperament:** at least two models are each self-consistent but disagree with each other.

Usage was measured by running the village on the consensus tables (20 villagers, 30 days, 20 seeds: 709,562 table lookups) and counting how often each row is consulted. For the two-option tables (where to go, what to do), the first answer is weighted by how often it was actually chosen (75%) and the second by how often it was chosen (25%). For each fill, the share of real decisions where its answer differs from the consensus was then calculated.

### Results

**Completeness.** All 9 fills returned all 240 rows using only allowed words. No fill needed correcting or a follow-up request.

**Self-consistency (run 1 vs run 2):**

| Arm | Rows identical | Cells identical |
| --- | --- | --- |
| Gemini (free) | 91% | 95% |
| Opus, normal chat | 86% | 92% |
| Opus, incognito | 85% | 92% |
| ChatGPT (free) | 66% | 82% |

**Agreement between arms (mean row agreement; cells in brackets):**

| | Opus normal | Opus incognito | Gemini | ChatGPT |
| --- | --- | --- | --- | --- |
| Opus normal | 86% (92%) | 85% (91%) | 76% (86%) | 63% (75%) |
| Opus incognito | | 85% (92%) | 75% (85%) | 63% (77%) |
| Gemini | | | 91% (95%) | 64% (78%) |
| ChatGPT | | | | 66% (82%) |

**Agreement across all eight blind fills:**
- 104 of 240 rows (43%) were unanimous across all eight.
- 178 of 240 rows (74%) had at least six of eight fills agreeing.
- 323 of 537 individual answers (60%) were unanimous.
- Agreement varied by table:
  - Highest: mood (92–100% of rows match the consensus), apology, and stance.
  - Lowest: what to do in an encounter (46–83%) and how beliefs shift behaviour (61–89%).

**Context gradient (agreement with the developer's rule tables):**

| Fill | Rows identical to rule tables |
| --- | --- |
| Dev chat (knows the rule tables) | 66% |
| Gemini, runs 1 and 2 | 62%, 63% |
| Opus normal, runs 1 and 2 | 57%, 55% |
| ChatGPT, runs 1 and 2 | 56%, 55% |
| Opus incognito, runs 1 and 2 | 55%, 57% |
| Blind consensus | 62% |

The dev-chat fill agreed with the blind consensus on 75% of rows (85% of cells).

**Where disagreement sits, and how much it matters in use (v3):**

| Decision | Share of all lookups | Rows unanimous | Noise cells | Temperament cells | Usage-weighted chance a fill differs from consensus |
| --- | --- | --- | --- | --- | --- |
| Where to go (main choice) | 27% | 26/27 (main choice) | 1 | 0 | 0% |
| Where to go (backup choice) | (25% of the above) | 13/27 | 9 | 5 | 15% |
| Mood change | 9% | 11/12 | 0 | 1 | 2% |
| Stance toward someone | 8% | 24/36 | 8 | 4 | 4% |
| What to do (main choice) | 8% | 14/24 (main choice) | 2 | 8 | 31% |
| What to do (backup choice) | (25% of the above) | 3/24 | 14 | 7 | 33% |
| Reaction to trust events | 7% | 15/36 | 7–20 across columns | 5–11 | 5–19% |
| Belief → behaviour | 5% | 4/18 | 0–4 per trait | 2–4 | 4–10% |
| Apologise? | 1% | 6/9 | 3 | 0 | 2% |
| Reaction to status events | 1% | 16/54 | 3–17 | 12–18 | 5–14% |
| Reaction to work outcome | 1% | 5/12 | 0–6 | 1–3 | 9–11% |
| Grudge | <1% | 7/12 | 3 | 2 | 8% |

The designer tables (needs, belief change) account for the remaining third of lookups and are identical in every condition.

**Share of real decisions where a fill's answer differs from the blind consensus:**
- Opus 2–9%;
- Gemini 10%;
- ChatGPT 9–13%;
- dev chat 10%.

**Notable patterns:**
- **A villager whose core belief is "people are against me" is helped, or receives an apology.** All four Opus fills and both Gemini fills answered `nothing much`, with no effect on the belief. Both ChatGPT fills answered `good sign`, with the belief `strained`. The same split appeared in an earlier pilot. This pattern ("kindness doesn't touch a core grievance") was not described in the prompt.
- **ChatGPT read `good sign` as "confirms the villager's existing view".** For example, in run 2, a bad day of work for someone who believes "nothing I do matters" was rated a `good sign` at every strength. In run 1, being argued with confirmed "people are against me" in the same way. No other model did this.

### Interpretation (for discussion)

- **Tables can be filled reliably from a short, neutral prompt.** Every fill was complete and valid on the first attempt, including free-tier Gemini and ChatGPT, so producing a full psychology for the village costs one message per model.
- **Repeat runs of the same model mostly agree** (85–91% of rows for Opus and Gemini), and remaining differences cluster in the less constrained tables. Running each model more than once and keeping the majority answer is therefore a sensible step.
- **Incognito made no detectable difference.** Opus in a normal chat agreed with Opus incognito (85%) as often as either agreed with itself (85–86%). For practical use, developers don't need special chat settings to get a clean fill.
- **Different model families give partly different "cultures".** Opus and Gemini agree on about three-quarters of rows; ChatGPT agrees with both on about two-thirds and with itself on only two-thirds. The choice of teacher model is a design decision with visible consequences, consistent with the hypothesis that the teacher's worldview becomes the village's culture. Whether these differences change how the village behaves is tested separately.
- **Disagreements are concentrated, not random.** Most rows have a clear majority (74% have six or more of eight fills agreeing). Contested rows identify situations where "a typical person" is genuinely ambiguous, or where the wording is unclear. These are exactly the rows a designer should review, and the method finds them automatically.
- **Prompt wording matters, and blind fills reveal ambiguity.** ChatGPT's reading of `good sign` as "confirms my view" is a defensible interpretation of the wording, and it was consistent across runs. Future prompts should define each meaning in terms of feeling (for example, "pleased"), not belief.
- **Knowing the answer key moved the fill only modestly toward it.** The fully informed dev chat matched the rule tables on 66% of rows, against 55–63% for blind fills, and still agreed with the blind consensus on 75% of rows. Even the developer's own judgement, row by row, departs from rules the same developer wrote. That supports filling tables by judgement rather than by formula.
- **Psychologically plausible patterns emerged without being asked for.** Kindness doesn't reduce a core grievance; high pride amplifies slights; low warmth leads to holding grudges and paying back. These appeared in blind fills from models that knew nothing of the project's hypotheses.
- **Disagreement on paper is much smaller per decision** *(revised in v4; see Experiment 3)*. Fills differ on 14–45% of rows but only 2–13% of the decisions villagers actually make. Experiment 3 shows, however, that these small per-decision differences compound into large differences between villages. The most used decisions (where to go, mood, stance) are the most agreed, while the most contested rows (status reactions, grudges, rare belief combinations) are rarely reached.
- **The one heavily used, genuinely contested decision is "what to do" in an encounter.** Fills differ from consensus on about a third of these choices, mostly through model temperament (for example, how readily a cold, dishonest villager takes credit, or whether a hostile one argues or interrupts). This is the table that most shapes visible behaviour, and where teacher choice will matter most.
- **Backup choices are noisier than main choices.** Models agree on what a person would most likely do, but much less on what they'd do instead. That's expected for a "second most likely" judgement, and it's diluted in use because backups are taken only a quarter of the time.
- **Two kinds of disagreement need different fixes.** Noise (a model disagreeing with itself) is reduced by repeat runs and majority voting. Temperament (models consistently differing) is a genuine design choice of teacher, best handled by choosing the teacher deliberately or reviewing those specific rows.
- Usage depends on the village: these weights come from one setting (20 villagers, three rooms) and the consensus tables. Rarely reached rows could matter more in other settings. Whether the remaining differences change village outcomes is tested in Experiment 3.
- **Limitations:**
  - two runs per arm, and one for the dev chat;
  - model versions are self-reported and may change over time;
  - the prompt gained one line (asking for the model name) between runs;
  - agreement is measured on exact wording, which treats near-synonyms as disagreement;
  - the consensus tie-break leans toward the developer's rules in 27 tied cells (out of 537);
  - this experiment measures the tables, not the behaviour they produce.


---

## Experiment 3: Spread of lives, controls, and teacher culture

### Methods

**Aim.** To test three things:
- whether the same villagers live measurably different lives across runs;
- whether that variety and the village's social structure come from the belief loop, the villagers' traits and the psychology in the tables, rather than from the room and meeting rules alone;
- whether tables filled by different teachers produce different villages.

**Setup.**
- The same 20 villagers (fixed starting cast) were run for 60 days on 50 new random seeds (101–150), never used during calibration.
- The main condition used the blind consensus tables from Experiment 2.
- Measures were defined in the analysis code before these runs. The "keystone row" analysis below is exploratory: it was done after seeing the results.

**Conditions:**
- consensus tables (main);
- belief loop off: beliefs can never change;
- traits off: every villager has average temperament;
- shuffled tables: the same answers reassigned to the wrong situations (control);
- random tables: random allowed answers (control);
- the developer's hand-written rule tables;
- each of the nine individual teacher fills from Experiment 2.

**Measures.**
- **Spread of lives**, per villager across the 50 seeds:
  - how different their final beliefs are (average distance between end states on the three belief ladders);
  - how many distinct belief endings occur;
  - how much their number of friends varies;
  - how much their share of unkind acts varies.
- **Village outcomes**: friendships (mutual liking), feuds (mutual dislike), isolated villagers, belief changes, core-belief breaks, and the share of encounters that were unkind (argue, interrupt, ignore, take credit).
- Uncertainty: 95% confidence intervals across seeds, bootstrapped for the spread measures.

### Results

**Spread of lives and village outcomes:**

| Condition | Belief distance | Distinct endings per villager | Variation in friends (SD) | Friendships | Feuds | Unkind acts |
| --- | --- | --- | --- | --- | --- | --- |
| Consensus tables | 1.74 | 10.2 of 50 | 1.69 | 96 | 3.8 | 7.2% |
| Belief loop off | 0 (frozen) | 1 | 1.11 | 82 | 5.8 | 9.7% |
| Traits off | 1.61 | 5.5 | 1.34 | 155 | 0.1 | 0.3% |
| Shuffled tables | 4.45 | 29.0 | 3.51 | 13 | 10.8 | 41.5% |
| Random tables | 4.06 | 28.3 | 3.44 | 8 | 36.1 | 48.7% |
| Hand-written rule tables | 2.42 | 13.6 | 1.87 | 84 | 3.3 | 4.9% |

**Villages built from individual teacher fills:**

| Fill | Friendships | Feuds | Isolated villagers | Belief changes | Core breaks | Unkind acts |
| --- | --- | --- | --- | --- | --- | --- |
| Opus normal, run 1 | 140 | 2.4 | 0 | 84 | 1.1 | 3.0% |
| Opus normal, run 2 | 102 | 14.2 | 0 | 91 | 1.4 | 19.6% |
| Opus incognito, run 1 | 87 | 7.0 | 0 | 87 | 2.0 | 5.9% |
| Opus incognito, run 2 | 93 | 8.9 | 0 | 116 | 5.7 | 11.0% |
| Gemini, run 1 | 57 | 25.6 | 0.1 | 196 | 23.2 | 23.8% |
| Gemini, run 2 | 57 | 23.2 | 0 | 281 | 39.1 | 24.0% |
| ChatGPT, run 1 | 34 | 1.7 | 2.4 | 169 | 21.5 | 2.5% |
| ChatGPT, run 2 | 95 | 16.9 | 0 | 245 | 32.9 | 19.3% |
| Dev chat | 90 | 7.3 | 0 | 102 | 2.3 | 6.8% |

Confidence intervals for village outcomes were narrow (for example, consensus friendships 96.2 ± 1.6), so these differences are far larger than seed-to-seed noise.

**Keystone rows (exploratory).** Weighting row differences by how often villagers use them, the gaps between villages came mainly from a few frequently used rows:
- whether small talk counts as a `good sign` for a villager who believes people mean well (if it does, mood and liking rise with every chat, starting a friendliness spiral);
- whether a *friendly* villager with low honesty sometimes takes credit for others' work (which seeds offences between people who like each other);
- what an idle villager with low diligence and low sociability does with free time.

### Interpretation (for discussion)

- **The same people live different lives.** With fixed starting characters, each villager reached on average about 10 different belief endings across 50 runs. What happens to them, not just who they are, shapes how they end up.
- **The belief loop adds variety and changes the society.** With the loop on, villagers' social lives varied about 50% more between runs, and the village was friendlier (96 vs 82 friendships) with fewer feuds (3.8 vs 5.8). Changing beliefs let villagers recover from bad starts rather than staying locked into early impressions.
- **Personality creates social structure.** With every villager average, conflict almost vanished (0.1 feuds) and nearly everyone became friends. Feuds, grudges and cliques depend on differences between people, as in the earlier Pecking Order prototype.
- **The structure comes from the psychology in the tables.** With the same answers reassigned to the wrong situations, the village became chaotic: over 40% of encounters unkind, few friendships, many feuds, wildly different outcomes from run to run. The room and meeting rules alone don't produce a believable society; the tables' fit to situations does.
- **More variety isn't automatically better.** Shuffled and random tables produced the most varied lives, but meaningless ones. Spread of lives is only meaningful alongside a plausible society, so both should be reported together.
- **Small table differences compound into large village differences.** Fills that differed on only 2–13% of decisions (Experiment 2) produced villages ranging from warm and peaceful to tense and feud-ridden. This held even between two runs of the same model. The engine is path-dependent by design: a different act changes moods, liking and beliefs, which change later acts.
- **The teacher's worldview becomes the village's culture.** This was a hypothesis of the project, and here it is strongly supported with blind fills. Gemini's tables consistently gave a tense, high-conflict village (both runs). Opus tables gave warmer villages. ChatGPT varied most between runs.
- **Practical consequence:** a single fill is not enough to set a village's culture. Majority voting across several runs and models gives a middle-of-the-range, more stable culture, and the few keystone rows that drive outcomes can be found automatically and reviewed by a designer. Update QC (simulating old vs new tables before release) is essential, not optional.
- **Limitations:**
  - one village size and setting;
  - 60 days;
  - outcomes measured with simple social counts, not human judgements of believability;
  - keystone rows identified after the fact.

---

## Experiment 4: Decision traces and a one-row edit

### Methods

**Aim.** To test whether every decision can be traced to readable table rows, and whether editing one row changes the targeted behaviour in a predictable way.

**Traces.** From one run (seed 101, consensus tables), the first three encounters where a villager took something as an insult were reconstructed from the decision log: every table consulted by both villagers in that hour, with inputs and outputs.

**One-row edit.** One row of the consensus "what to do" table was changed: for a *friendly* villager with low honesty in the field, the backup act changed from `take credit` to `chat`. This row was chosen after Experiment 3 identified it as a keystone row. Both versions were run on the same 50 seeds (101–150), 60 days, and each seed was compared with itself (paired design). Changes were judged against seed-to-seed variation (the standard deviation across seeds without the edit).

### Results

**Example trace (hour 7, day 1, in the field).** Villager n0017 has high warmth, neutral liking toward n0020 and a calm mood → `friendly`. With low honesty in the field, the act row gives `help`, with backup `take credit`; the backup was drawn. n0020 has the core belief "I am respected" and high pride → takes it as an `insult`, the belief comes under strain, liking falls, mood drops from good to low, and the grudge table gives `hold grudge`. Every step is one readable row.

**One-row edit (50 paired seeds):**

| Measure | Before | After | Change (95% CI) | Change in units of seed-to-seed variation |
| --- | --- | --- | --- | --- |
| Credit-taking events | 359.5 | 0 | −359.5 ± 8.8 | −11.3 |
| Unkind acts | 7.2% | 0.3% | −6.9 ± 0.2 points | −9.7 |
| Belief changes | 210.5 | 150.9 | −59.5 ± 4.2 | −5.2 |
| Friendships | 96.2 | 110.6 | +14.5 ± 2.1 | +2.4 |
| Feuds | 3.8 | 0 | −3.8 ± 0.5 | −2.1 |
| Field hours | 6,469 | 6,196 | −274 ± 60 | −1.6 |
| Days worked | 707 | 687 | −20 ± 7 | −1.0 |
| Hunger events | 3,382 | 3,411 | +29 ± 8 | +0.8 |
| Share of good work days | 56.9% | 57.0% | +0.1 ± 0.3 points | +0.05 |

### Interpretation (for discussion)

- **Every decision is explainable in plain words.** A trace reads as a short story ("friendly but dishonest, took credit; a proud, respected villager took it as an insult and held a grudge"), with each step tied to one row a designer can read and edit.
- **One row can be a keystone.** In this village, all credit-taking came from a single row: friendly villagers with low honesty occasionally taking credit. Changing that row removed credit-taking entirely, and feuds with it.
- **Edits act where intended, with knock-on effects that follow the story.** The targeted behaviour changed by over 11 times normal seed variation. Social consequences followed (more friendships, no feuds, fewer belief changes), because fewer offences meant fewer grudges. Measures unrelated to social life (work success, hunger) stayed within normal variation. Time in the field fell modestly, a plausible downstream effect (calmer villagers socialise more).
- **This is what makes compiled minds controllable.** A designer who wants "no feuds among friends" can find and change the responsible row and verify the effect in seconds. That kind of edit is hard to make reliably in a live LLM.
- **Caution:** the prediction "only the targeted behaviour changes" is too strong for a socially connected village. The honest claim is "the targeted behaviour changes strongly, social consequences follow, and unrelated systems stay within noise."

---

## Experiment 5: Sensitivity to arbitrary settings

### Methods

**Aim.** To check whether the conclusions of Experiment 3 depend on the arbitrary numbers chosen in the specification.

**Variations** (one at a time, each to a lower and higher value):
- how often the backup choice is taken (15% or 35%, instead of 25%);
- how many positive or negative interactions shift liking a step (2 or 4, instead of 3);
- how many days of evidence beliefs weigh (5 or 10, instead of 7);
- how much evidence is needed to move a belief (looser or stricter thresholds);
- how fast villagers get hungry (4 or 6 per hour, instead of 5).

These settings were exposed as parameters with the specification's values as defaults; the reference fingerprints were confirmed unchanged.

**Setup.** Consensus tables, 30 seeds (101–130), 60 days. Each variation was run with the belief loop on, with it off, and with shuffled tables. Three conclusions were checked under each variation:
- **C1:** the loop makes social lives more varied;
- **C2:** the loop makes the village friendlier with fewer feuds;
- **C3:** shuffled tables give at least twice the unkindness of the real tables.

### Results

| Variation | Friend variation, loop on / off | Friendships on / off | Feuds on / off | Unkind acts, real / shuffled | C1 | C2 | C3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Specification defaults | 1.69 / 1.14 | 97 / 81 | 3.9 / 5.8 | 7.1% / 43.1% | ✓ | ✓ | ✓ |
| Backup choice 15% | 1.71 / 1.09 | 83 / 76 | 1.8 / 2.4 | 5.0% / 40.7% | ✓ | ✓ | ✓ |
| Backup choice 35% | 1.71 / 1.00 | 100 / 77 | 6.0 / 9.0 | 9.2% / 44.7% | ✓ | ✓ | ✓ |
| Liking step 2 | 1.54 / 1.03 | 114 / 94 | 6.5 / 9.4 | 8.5% / 42.8% | ✓ | ✓ | ✓ |
| Liking step 4 | 1.76 / 1.08 | 78 / 69 | 2.9 / 3.6 | 6.6% / 42.7% | ✓ | ✓ | ✓ |
| Evidence window 5 days | 1.70 / 1.14 | 99 / 81 | 4.5 / 5.8 | 7.5% / 42.7% | ✓ | ✓ | ✓ |
| Evidence window 10 days | 1.66 / 1.14 | 95 / 81 | 3.9 / 5.8 | 7.2% / 42.8% | ✓ | ✓ | ✓ |
| Looser evidence thresholds | 1.65 / 1.14 | 88 / 81 | 4.4 / 5.8 | 7.3% / 43.6% | ✓ | ✓ | ✓ |
| Stricter evidence thresholds | 1.65 / 1.14 | 104 / 81 | 4.0 / 5.8 | 7.4% / 42.0% | ✓ | ✓ | ✓ |
| Hunger 4 per hour | 1.74 / 1.00 | 100 / 85 | 4.3 / 6.3 | 7.3% / 43.2% | ✓ | ✓ | ✓ |
| Hunger 6 per hour | 1.77 / 1.13 | 94 / 81 | 3.1 / 5.8 | 6.9% / 42.6% | ✓ | ✓ | ✓ |

### Interpretation (for discussion)

- **The conclusions don't depend on the arbitrary numbers.** All three held under all eleven settings tested.
- **The numbers change the size of effects, not their direction.** For example, a more frequent backup choice raises conflict across the board, and an easier liking step raises friendships. These act as global "tuning dials", separate from the psychology in the tables.
- **The tables matter more than the dials.** Across all parameter variations, friendships with the real tables ranged from about 78 to 114. Across the individual teacher fills (Experiment 3), they ranged from 34 to 140. Which psychology fills the tables shapes the village more than how the engine's constants are set.
- **Limitations:** one variable at a time (no interactions); 30 seeds per condition; consensus tables only.


---

## Experiment 6: Speed, cost and scale

### Methods

**Aim.** To measure how fast the engine runs on ordinary consumer devices as the population grows; what it costs compared with a design where a live LLM chooses each villager's actions; how much of a consumer AI plan the method uses; and how the number of people each villager knows affects cost and social life.

**Speed on devices.** A self-contained web page ran the village on the blind consensus tables, decision logging off. It grew the population from 10 to 1,000,000 villagers in steps of roughly ×3. It stopped when one in-game hour took longer than a game pace of one in-game day per 5 real minutes allows (18.75 s per in-game hour), or before the estimated memory exceeded a safe limit for a browser tab (1.6 GB on devices reporting 8 GB of memory; less otherwise). Each size was timed over whole in-game hours (3 repeats, median, up to 1,000 villagers; 1 run above). Devices:
- a desktop PC (Intel i5-10400, 12 logical cores, 8 GB RAM), tested in the Claude desktop app's built-in browser and in Microsoft Edge;
- a Google Pixel 10 Pro XL (2025) and a Samsung Galaxy A54 (2023), both inside the Claude mobile app's browser.

**Cost.**
- **Table approach:** a one-time fill. The single-message prompt is about 15,000 characters and each 240-row reply about 11,500 characters; at roughly 3 characters per token for table text, that is an estimated 5,000 input and 4,000 output tokens per fill.
- **Live-LLM approach:** at least one model call per villager per in-game hour to choose where to go and what to do, with an assumed 300 input tokens (state and options) and 20 output tokens. This is a deliberate underestimate: the engine itself consults about 3–4 tables per villager per hour, and a live design would also need calls to appraise events.
- At a pace of one in-game day per 5 real minutes, each villager makes 192 such decisions per real hour.
- Prices are published API list prices per million tokens as of November 2026: Claude Haiku 5.5 $0.10 in / $0.50 out; Claude Sonnet 5.5 $2/$10; Claude Opus 5.5 $4/$20; GPT-5.5 $5/$30; Gemini 2.5 Flash-Lite $0.10/$0.40.

**Consumer plan usage.** Published or widely reported usage allowances for consumer chat plans (Claude Free and Pro, ChatGPT Free, Gemini free) were compared with what the method needs.

**Acquaintance circles.** In the reference village, everyone in a hamlet knows everyone else in it, so a villager knows about 20 people. Circles of about 20, 50 and 100 acquaintances were compared:
- **Cost:** 30,000 villagers; memory per villager after setup; time per in-game hour over one in-game day; one clean process per measurement.
- **Social outcomes:** 1,000 villagers, 30 days, 10 seeds (101–110), consensus tables.

### Results

**Speed on devices** (real time per in-game hour; figure: `fig_speed_scaling`):

| Villagers | PC, Claude app | PC, Edge | Pixel 10 Pro XL | Galaxy A54 |
| --- | --- | --- | --- | --- |
| 100 | 0.13 ms | 0.13 ms | 0.34 ms | 0.45 ms |
| 1,000 | 1.0 ms | 1.1 ms | 1.7 ms | 3.0 ms |
| 10,000 | 11 ms | 12 ms | 10 ms | 27 ms |
| 100,000 | 119 ms | 130 ms | 101 ms | 249 ms |
| 300,000 | 310 ms | 414 ms | 262 ms | (memory limit) |

- **Cost per villager is constant:** about 1 µs per villager per in-game hour on the PC and Pixel, about 2.5 µs on the A54, from 1,000 to 300,000 villagers.
- **Every test stopped at the memory limit, never at speed.** The largest runs used at most 2.2% of the 18.75-second budget per in-game hour.
- Up to about 10,000 villagers, a full in-game hour fits within one 60-frames-per-second video frame (16.7 ms) on the PC and the Pixel.

**Cost of the two approaches:**

| Model | One-time table fill | Live LLM, per villager per real hour | Live LLM, 1,000 villagers per real hour |
| --- | --- | --- | --- |
| Claude Haiku 5.5 | ~$0.003 | ~$0.008 | ~$7.70 |
| Gemini 2.5 Flash-Lite | ~$0.002 | ~$0.007 | ~$7.30 |
| Claude Sonnet 5.5 | ~$0.05 | ~$0.15 | ~$154 |
| Claude Opus 5.5 | ~$0.10 | ~$0.31 | ~$307 |
| GPT-5.5 | ~$0.15 | ~$0.40 | ~$403 |

With tables, runtime cost is zero: the full set of eight blind fills used here would cost under $1 at API prices, once, for any number of villagers and any length of play.

**Consumer plan usage:**
- A table fill is **one (long) message**. All fills in Experiment 2 were made within free or standard plans without hitting a limit.
- Allowances, as reported:
  - Claude Free's limit is unpublished and varies with demand; independent reports suggest roughly 15–40 messages per 5-hour window.
  - Claude Pro gives at least 5 times Free's usage; about 45 messages per 5-hour window is commonly cited.
  - ChatGPT Free has had unlimited everyday text chats since August 2026, subject to abuse safeguards.
  - Gemini's free limits are compute-based and unpublished.
- A live-LLM village is not feasible on any consumer plan. 1,000 villagers need about 192,000 decisions per real hour, against roughly 9 messages per hour on Claude Pro.

**Acquaintance circles:**

| Acquaintances per villager | Memory per villager | Time per villager per in-game hour | Friends per villager (day 30) | Villagers with no friends | Unkind acts |
| --- | --- | --- | --- | --- | --- |
| ~20 | 3.3 KB | 1.8 µs | 6.1 | 0.3% | 5.4% |
| 50 | 7.5 KB | 2.6 µs | 4.7 | 1.1% | 5.2% |
| 100 | 14.0 KB | 3.8 µs | 1.7 | 4.1% | 5.2% |

(Measured on the cloud test machine, which is slower than the PC; compare the rows with each other, not with the device table.)

### Interpretation (for discussion)

- **Decisions are effectively free; memory sets the ceiling.** Time per villager stays constant as the population grows, and ordinary phones and PCs ran 100,000–300,000 villagers within about 2% of a relaxed game pace. What runs out first is memory for relationship records. That matches the original prediction that relationships, not decisions, would be the bottleneck.
- **Consumer hardware is enough.** A 2023 mid-range phone ran 100,000 villagers at about a quarter of a second per in-game hour. Browser engines (desktop app versus Edge) made little difference.
- **The cost gap is several orders of magnitude.** Filling the tables costs cents, once. A live LLM costs per decision, forever. Even with the cheapest models and a deliberately low estimate of one call per villager per hour, 1,000 villagers would cost about $7 per real hour (and $150–$400 with frontier models). The tables cost nothing at runtime.
- **The method fits inside free consumer plans.** One table set takes one message on a free plan. A live-LLM village can't run on consumer plans at all, so the table approach is the one available to hobbyists and small studios.
- **Latency matters as much as cost.** A model call takes a substantial fraction of a second or more; a table decision takes about a microsecond. Live designs need large-scale parallel calls and rate-limit headroom; tables need neither.
- **Knowing more people costs memory roughly in proportion and time modestly.** Going from about 20 to 100 acquaintances quadrupled memory per villager (3.3 to 14 KB) and roughly doubled time per villager.
- **Bigger circles produced fewer friendships within 30 days.** With 100 acquaintances, villagers averaged 1.7 friends instead of 6.1, and 4% had none. Interactions spread over more people, so repeated contact with any one person, which liking needs, becomes rarer. This loosely echoes the observation that cities breed isolation, but it may partly reflect the 30-day horizon and the fixed liking step. City design should separate *acquaintances* (cheap, many) from *relationships* (tracked, few), for example by creating relationship records only on repeated contact.
- **Limitations:**
  - token counts are estimates (±30%);
  - the live-LLM cost uses assumed prompt sizes and one call per villager-hour, so it is a lower bound;
  - consumer plan limits are vendor-controlled and change often;
  - device memory estimates are approximate and the safe-limit rule is conservative;
  - circle-size social results use one table set and 30 days.

## Experiment 7: Tables versus a live AI on the same moments

### Methods

- We ran the village with the consensus tables (seed 101, 20 villagers) and sampled 40 real moments from days 8–30: 12 room choices, 14 encounter acts and 14 reactions to another villager's act.
- Each moment was written out in plain language with everything a live AI would want: personality, beliefs and how strongly they are held, mood, current liking, and the last three interactions between the pair.
- For each moment we recorded three answers:
  - the **table** answer (what the village actually used);
  - the **rules** answer (the designer's hand-written baseline tables, applied to the same inputs);
  - the **live AI** answer: the whole set was pasted once, unchanged, into a fresh Claude Opus 5.5 incognito chat and a ChatGPT free Temporary Chat (self-reported GPT-6).
- Agreement counts identical answers. For reactions both the meaning and the liking change must match.
- **Blind judging.** The 18 moments where the sources disagree are shown with their distinct answers, unlabelled and in shuffled order, to three judge models, which rated each answer's believability from 1 (makes no sense for this villager) to 5 (exactly what I'd expect):
  - ChatGPT Temporary Chat (GPT-6). It also gave live answers, so it may favour its own style; it was not told which answers were its own.
  - Gemini incognito (self-reported 3.1 Flash Lite), which gave no answers.
  - Gemini incognito with high, extra-thorough thinking (exact model not reported), which also gave no answers.
- The two Gemini judges have no stake in the outcome and are averaged as the **neutral** judges.
- Each source's score is the mean rating of the answer it gave, across the 18 disputed moments. An answer shared by several sources counts for each of them.

### Results

| Comparison | All (40) | Room (12) | Act (14) | Reaction (14) |
| --- | --- | --- | --- | --- |
| Tables vs rules | 32 | 11 | 9 | 12 |
| Live Opus 5.5 vs tables | **38** | 11 | 14 | 13 |
| Live Opus 5.5 vs rules | 30 | 10 | 9 | 11 |
| Live GPT-6 vs tables | 29 | 11 | 9 | 9 |
| Live GPT-6 vs rules | 26 | 10 | 9 | 7 |
| Live Opus 5.5 vs live GPT-6 | 27 | 10 | 9 | 8 |

- Both live models matched the tables more often than the rules.
- Live Opus 5.5 differed from the tables on only 2 of 40 moments: one room choice and one reaction strength ("slight" versus "insult").
- Live GPT-6 differed mostly on reaction strength (it read arguments and credit-taking as "insult" where the tables said "slight"). On acts it chose kinder options in two moments where the tables chose "take credit" or "chat", and harsher in one ("argue" for a friend).
- Both live models agreed with the tables that a friendly, low-honesty villager takes credit (Q26). Live Opus agreed on the second such case as well (Q21).
- The two live AIs agreed with each other less (27/40) than either agreed with the tables.

**Blind believability ratings (18 disputed moments, 1–5):**

| Source | GPT-6 judge | Gemini Flash Lite | Gemini thinking | Neutral (both Gemini) |
| --- | --- | --- | --- | --- |
| Tables | 3.56 | **3.94** | **3.94** | **3.94** |
| Rules | 3.28 | 3.33 | 3.28 | 3.31 |
| Live Opus 5.5 | 3.33 | 3.78 | 3.83 | 3.81 |
| Live GPT-6 | **4.39** | 3.83 | 3.83 | 3.83 |

**Head to head, where a source's answer differed from the table's (rated better / tie / worse than the table):**

| Source | Moments | GPT-6 judge | Gemini Flash Lite | Gemini thinking | Neutral (both Gemini) |
| --- | --- | --- | --- | --- | --- |
| Rules | 8 | 3 / 0 / 5 | 0 / 3 / 5 | 1 / 1 / 6 | 1 / 1 / 6 |
| Live Opus 5.5 | 2 | 0 / 0 / 2 | 0 / 0 / 2 | 0 / 0 / 2 | 0 / 0 / 2 |
| Live GPT-6 | 11 | 10 / 0 / 1 | 4 / 2 / 5 | 3 / 3 / 5 | 4 / 1 / 6 |

- All three judges rated the tables above the rules, and above live Opus on the two moments where Opus differed.
- The GPT-6 judge preferred live GPT-6's answer over the table's in 10 of 11 cases. Both neutral judges split these cases roughly evenly, leaning slightly toward the tables.
- The two Gemini judges agreed closely with each other (correlation 0.77). The GPT-6 judge was the outlier (0.39 with each).
- Most disputes were about reaction strength: whether an argument or credit-taking is a "slight" or an "insult". The GPT-6 judge consistently preferred "insult"; the Gemini judge mostly did not.

### Interpretation (for discussion)

- **A table answer is usually what a live AI would have said in the moment.** That holds even though the live AI saw richer context (recent history, belief strength) that the table rows never see. Little seems lost by reducing a moment to a few words.
- **Live AIs disagree with each other more than with the tables.** Consensus tables average out the quirks of single models; a live AI brings its own house style to every decision.
- **Caveat: Opus agreement is partly self-agreement.** Four of the eight fills behind the consensus tables came from Opus, so live Opus agreeing 38/40 is expected in part. The cleaner comparison is GPT-6 (29/40), whose house style was a minority in the consensus.
- **Where tables and a live AI disagree, the table is not worse.** Both judges with no stake in the outcome, including a thinking model, rated the tables highest of all four sources, with near-identical scores. Only the GPT-6 judge preferred live GPT-6, and that is what self-preference would predict.
- **The tables beat the hand-written rules.** All three judges rated rule answers lowest. The AI-filled tables add believability over what a designer wrote by hand, which is the point of filling them with AI.
- **AIs judge "how much did that hurt?" differently.** Disagreements clustered on reaction strength, and the judges disagreed with each other there too. This is a matter of taste rather than error, and it is exactly what the teacher choice ("storyteller") would expose to players.
- **Limitations:**
  - one live sample per model;
  - 40 moments, of which 18 were disputed;
  - the moments come from one seed;
  - "rules" is a single designer's hand fill;
  - three judges: two from the same vendor (Gemini), and one (GPT-6) with a stake in the outcome;
  - the GPT-6 judge agreed only weakly with the others;
  - AI judges stand in for human players.

## Experiment 8: The suture (an outside mind steering one villager)

### Methods

- **Question.** If an outside mind (a player, an AI director, another villager's personality) makes one villager's choices for a while, does the villager become like that mind? And what happens when control ends?
- **Mechanism.** On "steered" days, the subject's choices use the mind's personality instead of its own:
  - where to go;
  - how to approach someone (warmth);
  - what to do (honesty);
  - whether to apologise.
  
  Its needs, mood, memories, relationships, reactions and beliefs all stay its own. The villager has no way to notice it is being steered. Any change has to come back through how others treat it.
- **Minds:**
  - a **cold** mind (low warmth, sociability, diligence and honesty; high pride);
  - a **warm** mind (the reverse);
  - two controls:
    - a **twin**, the villager's own starting personality, frozen;
    - **random**, a fresh random personality for every decision.
- **Dose.** Steered on 25%, 50%, 75% or 100% of days, spread evenly, for 60 days. Then 30 days released.
- **Design.**
  - Every one of the 20 villagers took a turn as the only subject, in 10 seeds (101–110), using the consensus tables.
  - Each steered life was compared with the same villager's unsteered life in the same seed: 200 baselines and 3,200 steered lives.
  - Ranges are 95% confidence intervals.
- The default engine is unchanged: the hook is off unless set, and all golden hashes still match.

### Results

**Did the villager's personality move toward the mind?** Change in distance to the mind's personality, in steps over 4 traits; positive means closer.

| Mind | 25% of days | 50% | 75% | 100% | 30 days after release (100%) |
| --- | --- | --- | --- | --- | --- |
| Warm | +0.20 ± 0.10 | +0.29 ± 0.10 | +0.40 ± 0.11 | +0.36 ± 0.11 | +0.24 ± 0.10 |
| Cold | −0.04 ± 0.10 | −0.20 ± 0.11 | −0.32 ± 0.12 | −0.32 ± 0.11 | −0.13 ± 0.11 |

**What happened to the villager's life?** Day 60, steered minus unsteered, 100% of days.

| Mind | Friends | Villagers who like them | Self-worth belief (steps) | Belief changes in 60 days (unsteered 10.2) | Core beliefs broken (unsteered 1.23) |
| --- | --- | --- | --- | --- | --- |
| Warm | +3.3 | +5.5 | −0.9 | 13.5 | 1.64 |
| Cold | −4.6 | −9.6 | −1.6 | 6.4 | 0.64 |
| Twin (control) | −0.6 | −0.9 | −1.0 | 10.7 | 1.33 |
| Random (control) | +3.2 | +4.2 | 0.0 | 13.7 | 1.66 |

**After release (day 90, 100% dose):**
- Warm-steered villagers kept most of their social gain (+3.1 friends).
- Cold-steered villagers recovered about 60% of their loss (−1.9 friends).
- Personality differences halved (trait shift 1.24 → 0.73 for cold, 1.28 → 0.82 for warm). The chance-only level is about 0.4–0.5 (twin control).

**Why.** Counts are per villager per 60 days.

| Mind | Hours at home / field / square (of 960) | Times praised | Times credit taken from them |
| --- | --- | --- | --- |
| Unsteered | 325 / 323 / 312 | 32 | 17 |
| Warm | 238 / 528 / 194 | 21 | 30 |
| Cold | 754 / 206 / 0 | 0 | 7 |

- The cold mind kept the villager at home three-quarters of the time and never in the square.
- The warm mind sent it to work, where others took credit for its effort.

**One life (villager n0017, seed 101, cold mind on every day):**
- **Unsteered:** n0017 slowly cooled from warm to middling, made 12 friends and 3 enemies, and came to believe it is overlooked.
- **Steered cold:** it was seldom wronged, because it was seldom anywhere. Its belief that "people mean well" deepened from *firmly held* to *core*, and its own warmth stayed high. Its outward life shrank to 6 friends, and only 2 villagers liked it.
- **After release:** within 30 days it rebuilt to 12 friends, 9 villagers liked it, and it had 1 enemy. That is a warmer person than its unsteered self.

### Interpretation (for discussion)

- **The body doesn't become the mind.** A warm mind pulled villagers modestly toward warmth. A cold mind pushed them slightly *away* from coldness, mainly by lowering pride. The mind reaches the villager's inner life only through how the world answers its behaviour, and the world answers where the behaviour puts it, not what the mind intended.
- **Steering mostly changes circumstances, and circumstances change beliefs.** Cold steering meant isolation, so no praise, so low self-worth, so lower pride (the opposite of the cold mind's high pride). Warm steering meant long hours in the field, so others took credit, so self-worth also fell, even as friendships grew. A saint in this village gets exploited.
- **Any outside control interrupts growth.** Even the twin control, the villager's own starting self frozen in place, lowered self-worth by a full step. Normally a villager who gains confidence becomes more sociable, goes to the square more, gets praised more, and gains more confidence. A steered villager can't act on who it is becoming, so that spiral stalls. This was the clearest result and wasn't anticipated.
- **No fracture, but instability.** Steering never shattered a villager: core-belief breaks were not above normal for any mind. Warm and random steering made beliefs churn more (more changes); cold steering made them churn less, because nothing happened to the villager.
- **Relationships outlast control; personality relaxes.** After release, personality differences fell toward chance, but social standing persisted, especially gains. Other villagers' liking is the slow variable. Damage from cold steering partly healed within a month.
- **Game implications.** A player "possessing" an NPC leaves a social footprint that lasts, and an inner-life footprint that fades. Possession doesn't need a special "identity" rule: the existing belief loop already produces believable after-effects (isolation, exploitation, stalled growth). The noted design idea of a self-perception table ("I notice I acted coldly") was deliberately left out. Without it, convergence toward the mind is weak. Adding it would be the lever if a game wanted possession to reshape personality.
- **Limitations:**
  - one table set (consensus);
  - two fixed archetypes;
  - one subject at a time;
  - 60 + 30 days;
  - work outcomes still use the villager's own diligence;
  - the "twin" control freezes the starting personality and so also measures frozen growth, not pure chance.
  - The chance-only level for personality and belief differences is not small (about 0.5 trait steps and 1.3 belief steps), so we report signed, averaged changes rather than raw differences.

## Experiment 9: A large village over a long time (added after AI-mediated reviewer analysis)

*This experiment was not part of the original plan. It was added after the draft paper was given to an AI model (ChatGPT, free tier, incognito) for critical review. Among its suggestions was a test of whether the village stays interesting over long periods with many more villagers.*

### Methods

- **Question.** Over a much longer time and a much larger population, do villagers keep changing, or does the village freeze, collapse into sameness, or spiral into conflict?
- **Setup.**
  - 1,000 villagers in 50 hamlets of 20, so there are 1,000 distinct starting personalities from the cast generator.
  - 1,000 in-game days, about 16 times longer than the other experiments.
  - Consensus tables, 5 seeds (101–105).
  - One run with the hand-written rule tables as a comparison.
- **Measures, checked every 50 days:**
  - **Inner life:**
    - belief changes per villager;
    - the share of villagers whose beliefs changed since the last check;
    - the number of distinct belief combinations in the population (216 possible);
    - the share of villagers whose beliefs are where they started.
  - **Social life:**
    - the share of likings (one villager's feeling toward another) that changed since the last check;
    - mutual friendships and feuds as a share of all pairs;
    - isolated villagers;
    - the share of acts that were unkind.
- The engine and tables were unchanged. Each run took about 18 seconds on the test machine.

### Results

![Long-run village](figures/fig_longrun.png)

| Day | Belief changes per villager per 100 days | Villagers whose beliefs changed (last 50 days) | Distinct belief combinations | Likings that changed (last 50 days) | Mutual friends (% of pairs) | Feuds (% of pairs) | Unkind acts |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | 10.1 | 51% | 135 | 25% | 53% | 3.4% | 7.0% |
| 250 | 10.0 | 40% | 131 | 4.9% | 57% | 6.8% | 9.7% |
| 500 | 10.1 | 38% | 117 | 2.2% | 57% | 9.3% | 11.2% |
| 1,000 | 10.1 | 37% | 115 | 1.6% | 57% | 11.1% | 12.0% |

*Mean of 5 seeds. Seeds differed very little: for example, feuds at day 1,000 ranged from 1,034 to 1,087 of 9,500 pairs.*

- **Inner lives never settled.**
  - From about day 100 to day 1,000, villagers kept changing their beliefs at a steady rate of about 10 changes per 100 days.
  - Every 50 days, more than a third of villagers held different beliefs than before.
  - By day 1,000 only 3% held the same beliefs they started with.
  - The population stayed diverse: about 115 of the 216 possible belief combinations were in use.
  - Beliefs did harden slowly: the share held deeply rose from 49% at day 50 to 60% at day 1,000.
- **Relationships set.**
  - Likings changed a lot early (25% in days 50–100), then less and less (1.6% per 50 days by the end).
  - Friendships plateaued by about day 250, at 57% of pairs.
  - Feuds kept slowly accumulating, from 3.4% of pairs at day 100 to 11% at day 1,000, though the rate of new feuds was falling. Unkind acts rose with them, from 7% to 12%.
  - Isolated villagers stayed rare (about 0.6%).
- **The hand-written rule tables showed the same pattern.**
  - Beliefs changed even faster (21 changes per 100 days).
  - Likings froze even harder (0.4% changing per 50 days).
  - Feuds reached 20% of pairs.

  So the freezing comes from the engine's mechanics, not from one teacher's tables.

### Interpretation (for discussion)

- **Villagers stay alive inside.** Over a period 16 times longer than the main experiments, with 1,000 different villagers, beliefs neither froze nor converged on one type. The belief loop keeps working indefinitely. This answers the concern that rule-based characters become repetitive.
- **Relationships need a way to fade.** The engine has no forgetting: once a pair are close friends or enemies, little moves them. That suits a story spanning months, but over years it produces a village of fixed friendships and slowly growing feuds. In people, relationships fade without contact, quarrels are patched up, and people arrive, leave and die. Version 2 needs at least one of:
  - liking that drifts slowly toward neutral without contact;
  - a reconciliation rule;
  - population turnover.
- **The feud drift is a warning about absorbing states.** A feud, once formed, is rarely undone, because grudges lead to more unkind acts. Over 1,000 days this slowly raised the share of unkind acts. Any long-running game would need a release valve (forgiveness, mediation, moving away), or this becomes a slow decline.
- **Scale cost nothing new.** 1,000 villagers for 1,000 days (16 million villager-hours) took about 18 seconds, consistent with Experiment 6.
- **Limitations:**
  - hamlets of 20, so each villager knows only 19 others;
  - no births, deaths or moves;
  - one table set plus one rule-table run;
  - 5 seeds;
  - the suggestion came from one AI reviewer.
