# Replication log (bottom-up reproduction of the paper from prompts)

Running record of how the replication was set up and run, for the Methods section that describes it. Newest entries at the bottom.

## Setup (2026-11-14)

- **Aim:** recreate every result in the paper from written prompts alone, in a session with no access to the original work. One prompt builds the engine (R0); one prompt per experiment reruns it (R1–R8). The replicating session never sees the original results; each reply is compared with them afterwards.
- **Replicating session:** Claude Opus 5.5, in a normal (non-incognito) chat, so that it can execute code. Incognito was not used because the earlier independent build (Experiment 1) ran in incognito and could not execute code.
- **Isolation:**
  - The chat runs inside a new, separate Claude Project, "Replication - prosopon preprint", with **project memory turned off**.
  - The new Project holds no documents from the original Project.
  - Prompts are pasted into the chat by the operator. Files are attached only where a prompt says to.
  - Every prompt instructs the session to work only from the chat, and to ignore and report anything it seems to remember about the project.
- **Leak check (2026-11-14, before R0):** in a new chat in the replication Project, the session was asked what it knew about the user or their projects.
  - It knew only the Project's name and that the Project was empty: no description, instructions or files.
  - It reported that memory is on, but that this Project keeps its memory separate from the account's general memory. It had nothing saved for the Project and could not see chats outside it.
  - It showed no knowledge of the engine, the experiments or the results.
  - The setting in effect is therefore **project memory separate (isolated)**, not fully off. The session can remember things within the replication Project itself, but nothing from the original work.
  - R0 was then pasted into a fresh chat in the same Project.
- **Blinding:** the prompts never say the work is a replication or that results already exist. They present it as a new study, so the session has no expected answer to aim for. (A first draft of R0 said "replication"; it was reworded before use.)
- **Data reuse:** experiments that used outside AI models (Experiment 2: table fills; Experiment 7: live answers and judge ratings) are rerun on the original, unedited AI replies, supplied as attachments. This tests whether the analysis is reproducible from the released data. It does not re-collect new AI outputs, which would mix in model randomness.
- **Comparison:**
  - Engine runs are compared by fingerprint (state and decision-log hashes), against an answer key held back from the replicating session.
  - Experiment results are compared by their reported numbers and by whether each conclusion holds.

## Prompts

| Prompt | Reproduces | Attachments | Status |
| --- | --- | --- | --- |
| R0 | Engine build (Experiment 1) | none | done: exact match |
| R1 | Experiment 2: teacher fill consistency | the nine original fills | done: exact match |
| R2 | Experiment 3: spread of lives, controls, teacher cultures | none | done: exact match |
| R3 | Experiment 4: one-row edit | none | done: exact match (new chat) |
| R4 | Experiment 5: sensitivity | none | done: exact match |
| R5 | Experiment 7: tables vs live AI | original moments, live answers, judge prompt and ratings | done: exact match after R5b clarification |
| R6 | Experiment 8: suture | none | done: exact match |
| R7 | Experiment 9: long run | none | done: exact match |
| R8 | Experiment 6: speed and cost | none (device runs by operator) | done: matches (exact for cost and circle social results; same range and pattern for timings) |

## R0 result: engine build (2026-11-14)

- **Session:** Claude Opus 5.5, normal chat in the replication Project, code execution on (Node v22).
- **Sources:** the session reported using only the prompt. It noted the Project's name and said it had ignored it.
- **Build:** all spec files, including the viewer. All 11 acceptance tests passed, plus an extra SHA-256 self-check the builder added.
- **Fingerprints:** all nine runs (A–I) matched the held-back answer key exactly, both state and decision-log hashes:
  - the two golden runs;
  - a 60-day run;
  - loop off;
  - traits off;
  - shuffled tables;
  - random tables;
  - 100 villagers in 5 hamlets;
  - 10,000 villagers.

  The cast and all 12 rule tables were byte-identical.
- **Independent verification:** the returned zip was unpacked and run on a separate machine. All nine fingerprints were reproduced from its code, so the reported hashes are genuine.
- **AI-filled tables (beyond the prompt):**
  - The new build was also run with all 11 table sets used in the paper: rules, 9 teacher fills and the consensus. Seeds 101–103, 60 days.
  - All 33 runs matched the original engine exactly.
  - Several ambiguities the builder flagged (grudge and liking interaction, apology with a negative meaning, pressure rules at core) only matter with AI-filled tables. It resolved all of them the same way as the original.
- **Ambiguities the builder reported:** 10, none affecting results. They include tick structure, cast belief format, and whether "moves applied" counts unapplied moves. These are candidates for a v1.0.2 clarification of the spec.

## R1 result: Experiment 2, teacher fill consistency (2026-11-14)

- **Inputs:** the nine original, unedited teacher replies, attached to the same chat.
- **Import:**
  - All nine fills imported with no missing or illegal rows.
  - The only clean-up was `1` → `+1` in the two Gemini fills (14 and 13 cells), as in the original.
  - All nine imported table sets were **byte-identical** to the originals.
- **Consensus:** all 12 table hashes matched the originals, as did the 27 ties and the hashes of a consensus run (seed 1, 30 days). The consensus tables used in R2 onward are therefore identical to the paper's.
- **Every reported number matched the paper**, to the precision reported:
  - self-consistency: Gemini 91%, Opus normal 86%, Opus incognito 85%, ChatGPT 66% of rows;
  - agreement between arms;
  - agreement across the eight blind fills: 104 rows unanimous, 178 rows with at least six agreeing, 323 of 537 cells unanimous;
  - the context gradient: dev 66%, consensus 62%;
  - dev vs consensus: 75% of rows, 85% of cells;
  - noise vs temperament counts per table and column;
  - usage weighting: 709,562 look-ups; per-fill differences of 2.3–13.3% of real decisions;
  - the T6 pattern: every Opus and Gemini fill said help or an apology means `nothing much` to a core "people are against me" belief, and both ChatGPT fills said `good sign / strained`.
- **Verification:** its analysis script was re-run independently from the returned zip and gave the same figures.
- **Not replicated:** the "keystone rows" analysis in Experiment 3 was exploratory and has no fixed procedure, so it is not part of the replication.

## R2 result: Experiment 3, spread of lives, controls and teacher cultures (2026-11-14)

- **Runs:** 750 (15 conditions × seeds 101–150 × 60 days). The run fingerprints for seed 101 matched the original engine in **all 15 conditions**. Checked independently from the returned zip.
- **Every reported number matched the paper:**
  - Spread of lives with the consensus tables: belief distance 1.74, 10.2 distinct endings, SD of friends 1.69. With the loop off: 0, 1 and 1.11.
  - Village outcomes, for example consensus 96 friendships, 3.8 feuds, 7.2% unkind acts; traits off 155, 0.1 and 0.3%; shuffled 13, 10.8 and 41.5%; random 8, 36.1 and 48.7%.
  - All nine teacher cultures, from ChatGPT run 1's 34 friendships to Opus normal run 1's 140.
- Bootstrap intervals differ slightly, as expected, because the replication used its own resampling stream. The point estimates are identical.
- **Observation from the replicating session, consistent with the original:** with traits off there are exactly 0 belief breaks, because under T11 only high-flexibility villagers can break a belief.

## Incident before R3 (2026-11-14)

- **What happened:** the operator accidentally pasted this replication log, instead of the R3 prompt, into the replicating chat. The log stated that the work was a replication and gave the R0–R2 outcomes. It contained no results for Experiments 4–9.
- **What was done:**
  - The message could not be cleanly removed: an edit would have kept the pasted log as an attachment. So the chat was abandoned.
  - The replication Project's memory was checked and found empty.
  - A new chat in the same Project was asked what it knew about the user or their projects. It knew nothing relevant.
  - R3 was then run in a further fresh chat. It received a short neutral continuation note, plus the session's own `village_R2.zip` (its engine, tables and scripts). The note asked it to rerun the acceptance tests before continuing.
  - All later prompts go to this new chat.
- **Impact:**
  - R0–R2 were already finished, so they are unaffected.
  - The R3 chat never saw the log.
  - Every reported number from R3 onward is also checked against independent re-runs of the returned code.

## R3 result: Experiment 4, decision traces and the one-row edit (2026-11-14)

- **Chat:** the new chat, continuing from the session's own R2 files. Its 50 original runs reproduced the R2 consensus runs exactly, and the edited run for seed 101 matched the original engine's fingerprint.
- **Part A, traces:** the first insult of seed 101 is the same encounter shown in the paper:
  1. n0017 (high warmth, low honesty) is friendly toward n0020;
  2. it draws the backup act `take credit`;
  3. n0020, who holds "I am respected" at core with high pride, takes it as an insult, with strain on the belief and liking down;
  4. n0020's mood drops from good to low, and it holds a grudge.
- **Part B, the one-row edit:** every number matched the paper to the precision reported:
  - credit-taking −359.5 ± 8.8 (−11.3 SD);
  - unkind acts 7.2% → 0.3% (−9.7 SD);
  - belief changes −59.5 ± 4.2;
  - friendships +14.5 ± 2.1;
  - feuds −3.8 ± 0.5;
  - field hours −274 ± 60;
  - days worked −20 ± 7;
  - hunger events +29 ± 8;
  - share of good work days +0.1 ± 0.3 points.
- **Reply received (2026-11-14):** it matches the zip's report.
  - The chat confirmed that the tests passed after unzipping.
  - It checked the replication Project's notes and memory before starting and found both empty.
  - It saved its R3 script into the replication Project as well as the zip. That is its own work, so isolation is unaffected.
- **Extra observation from the replicating session** (not asked for, and not in the original write-up): the edit removed credit-taking from *every* row, not only the edited one. Before the edit, about 80 credit-takings per run came from cold or hostile villagers. After it, there were none, because without friendly credit-taking dishonest villagers stop turning cold or hostile in the field. This is a knock-on effect of one row, and is worth a sentence in the paper.

## R4 result: Experiment 5, sensitivity (2026-11-14)

- **Settings:**
  - The session exposed the seven new settings as configuration. With defaults, all tests and golden hashes were unchanged, and its 90 spec-default runs reproduced the R2 runs exactly.
  - The seed-101 run fingerprints for 5 of the variants were checked against the original engine and matched. That means the settings were implemented identically from the prompt's description.
- **Results:**
  - Every number in the table matched Experiment 5 to the precision reported. For example, defaults gave SD of friends 1.69 / 1.14, friendships 97 / 81, feuds 3.9 / 5.8 and unkind acts 7.1% / 43.1%.
  - All three conclusions held under all 11 variants.
- **New point raised by the replicating session (correct, and worth adding to the paper):**
  - C2 was judged on point estimates.
  - The friendships half of C2 is clearly met everywhere: the smallest paired gap was +6.5 ± 2.5.
  - The feuds half is not statistically clear in two variants: backup choice 15% (−0.60 ± 0.66) and liking step 4 (−0.73 ± 0.76). Those 95% intervals include zero at 30 seeds.
  - C1 (SD gap ≥ 0.5) and C3 (shuffled tables 4.8–8.1 times as unkind) are clearly met.
  - The paper should say that the loop's effect on feuds is small and not distinguishable from zero under some settings.

## R5 result: Experiment 7, tables vs live AI (2026-11-14)

- **Moments:** all 40 were confirmed as real decisions in a replay of the original run (tick, villager, table and key).
- **Matched the paper exactly:**
  - every table answer;
  - every live-AI agreement count: tables vs live Opus 38/40, tables vs live GPT-6 29/40, live Opus vs live GPT-6 27/40;
  - every judge figure for the tables and both live AIs: tables 3.56 / 3.94 / 3.94, live Opus 3.33 / 3.78 / 3.83, live GPT-6 4.39 / 3.83 / 3.83;
  - the head-to-heads (live GPT-6 vs the tables 10/0/1, 4/2/5, 3/3/5) and the judge correlations (0.39, 0.39, 0.77).
- **One difference, from a gap in the written method, not in the engine:**
  - For act moments, the original analysis computed the **rules answer as a fully rules-driven villager would act**: its stance from the rule T3, then its act from the rule T4.
  - The R5 prompt (and the paper's draft methods) said only "the rule table's answer for the same row". The replicator applied the rule T4 to the consensus stance.
  - This changed the rules answer for 4 of the 14 act moments (Q13, Q14, Q16, Q21). Tables vs rules became 31/40 instead of 32/40, and the rules' judge means shifted slightly. The rules still ranked lowest for every judge.
  - It also explains what the replicator flagged as a mismatch: under its definition, the judged set lines up imperfectly with the moments where sources disagree.
  - **Action:** the paper's Methods must state the chained definition. Follow-up prompt R5b asks the session to recompute with that definition.

## R5b result: rules answer as a fully rules-driven villager (2026-11-14)

- With the chained definition (rules stance from the rule T3, then the rule T4), **every figure matched the original analysis exactly**:
  - tables vs rules 32/40 (11/9/12);
  - rules vs live Opus 30/40, rules vs live GPT-6 26/40;
  - rules judge means 3.28 / 3.33 / 3.28;
  - rules head to head with the tables 3/0/5, 0/3/5 and 1/1/6.
- The judged set now lines up exactly with the 18 moments where the four sources disagree, and every option matches a source.
- Q26's stance came from a `pay back` grudge, with no T3 look-up. The session kept that stance, as the original analysis did.
- **Paper fix:** the Methods for Experiment 7 must say the rules answer for acts is chained through the rule T3, and how grudge-driven stances are handled.

## R6 result: Experiment 8, the outside mind (suture) (2026-11-14)

- **Engine:** the session added the steering option from the written description. With steering off, every fingerprint was unchanged, and the R3 and R5 outputs reproduced byte for byte.
- **Step 2 (3,200 steered runs, 200 baselines):** every figure in all 16 rows (4 minds × 4 fractions) matched the original exactly, including the random mind, whose results depend on the exact order of random draws. For example, at 100% steering:
  - cold: toward-mind −0.32 ± 0.11, friends −4.63, liked by −9.60, worth −1.58;
  - warm: toward-mind +0.36, friends +3.31, liked by +5.50, worth −0.92;
  - twin: worth −0.98.
- **Step 3 (why):** identical room counts, praise and credit-taken counts for no steering, cold, warm and twin. For example, under the cold mind: 754 hours at home, 0 in the square, praised 0 times.
- **Step 4 (n0017):** an identical life story under no steering and under the cold mind.
- **Interpretation, from the replicating session itself:** it independently concluded that the cold mind pushes villagers *away* from coldness. Its explanation: steered villagers never go to the square, so they are never praised.

## R7 result: Experiment 9, long run (2026-11-14)

- **Runs:** 5 consensus seeds and 1 rule-table run, each 1,000 villagers for 1,000 days. 26–30 s per run on the session's machine; the original took about 18 s.
- **Every figure matched the original exactly,** for the means at every reported checkpoint and for each seed at day 1,000. For example, at day 1,000:
  - 10.1 belief changes per villager per 100 days;
  - 36.7% of villagers changed beliefs in the last 50 days;
  - 115.4 distinct belief combinations;
  - 1.62% of likings changed;
  - 57.5% of pairs friends, 11.1% feuding;
  - unkind share 12.0%, 60.3% of beliefs deeply held, 3.4% still as at start.
- **The rule-table run matched too:** 21.5 belief changes, 0.39% of likings changed, 20.4% of pairs feuding, 35 isolates.
- **The session's own reading matched the original:** inner lives stay active, while relationships set and feuds creep up.

## R8 result: Experiment 6, speed, cost and scale (2026-11-14)

- **Speed-test page:**
  - The session built it from the written description and tested it in headless Chrome with the network cut off.
  - Its built-in engine check reproduced the consensus seed-101 fingerprint on every device.
  - The operator ran it on the same four setups as the original: PC in the Claude desktop app, PC in Edge, Pixel 10 Pro XL, and Galaxy A54.
- **Speed (timings vary between runs, so same range and pattern was expected):**

  | Villagers | PC app | PC Edge | Pixel 10 Pro XL | Galaxy A54 |
  | --- | --- | --- | --- | --- |
  | 1,000 | 1.1 ms (orig. 1.0) | 1.7 (1.1) | 1.2 (1.7) | 2.4 (3.0) |
  | 10,000 | 10.7 (11) | 15.1 (12) | 8.8 (10) | 17.8 (27) |
  | 100,000 | 116 (119) | 112 (130) | 97 (101) | 152 (249) |
  | 300,000 | 300 (310) | 427 (414) | 293 (262) | memory limit (memory limit) |

  - The time per villager stayed constant, at about 1–1.5 µs per villager-hour (1.5–1.8 on the A54, which was faster this time than the original 2.5).
  - Every device stopped at its memory limit, never at speed. The largest run used at most 2.3% of the time budget.
  - The figure is `fig_speed_scaling_replication`.
- **Cost:** identical arithmetic to the original. For 1,000 villagers per real hour, live AI costs $7.68 (Haiku 5.5), $7.30 (Gemini 2.5 Flash-Lite), $153.60 (Sonnet 5.5), $307.20 (Opus 5.5) and $403.20 (GPT-5.5). A table fill costs $0.002–$0.15 once.
- **Acquaintance circles:**
  - **Social results matched exactly:** friends per villager 6.12 / 4.69 / 1.69; isolates 0.30 / 1.12 / 4.07%; unkind share 5.4 / 5.2 / 5.2%.
  - **Memory per villager** was 3.8 / 7.1 / 12.8 KB, against the original 3.3 / 7.5 / 14.0. Same pattern; heap measurements differ between machines and methods.
- **Not replicated:** the consumer-plan comparison. It is a reading of published plan limits, not an analysis.

## Overall result

- **All nine experiments were reproduced from written prompts alone,** in a separate, blinded session, with the original results withheld.
- **Every deterministic result matched exactly:**
  - the engine fingerprints;
  - the consensus tables;
  - all simulation and analysis results for Experiments 2–5 and 7–9;
  - the cost and circle social results of Experiment 6.
- **Results that depend on the machine** (timings, memory) were in the same range and showed the same pattern.
- **Differences, all traced to how the methods were written down rather than to the engine or analysis:**
  - Specification v1.0 did not say how villager IDs sort at 10,000 villagers. Fixed in v1.0.1, before this replication.
  - Experiment 7's "rules answer" for act moments needed its chained definition stated (R5b).
  - Bootstrap intervals differ slightly, because of the resampling stream.
- **New points raised by the replicating session:**
  - the one-row edit removes credit-taking from every row, a knock-on effect (R3);
  - the loop's effect on feuds is not statistically clear in 2 of 11 sensitivity variants (R4);
  - the judged set in Experiment 7 depended on the rules definition (R5).
- **Process issues, disclosed:**
  - an accidental paste of this log into the first chat before R3, handled by moving to a fresh chat;
  - the replicating session saved its scripts into its own Project.
