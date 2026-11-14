# Village simulation study, prompt R5 of 9: are table answers as believable as a live AI's?

Keep using the engine and the consensus tables. The same rules apply.

## Background

40 real moments were taken from one village run: consensus tables, seed 101, 20 villagers, 30 days, moments from days 8–30. They are:
- 12 room choices (T2);
- 14 encounter acts (T4);
- 14 reactions to another villager's act (T6 or T7).

Each moment was written out in plain words, with the villager's personality, beliefs and how strongly they are held, mood, liking, and the last three interactions between the pair. All 40 were given once, unchanged, to two live AI models in fresh chats:
- Claude Opus 5.5 (incognito);
- ChatGPT (free, temporary chat; self-reported GPT-6).

Each model answered every moment.

For the moments where the answers disagreed, a separate **judge prompt** listed each distinct answer, unlabelled and in shuffled order. Three judge models rated each option's believability from 1 to 5:
- ChatGPT (temporary chat, self-reported GPT-6). It is the same family as one of the live answerers.
- Gemini (temporary chat, self-reported 3.1 Flash Lite).
- Gemini (temporary chat, high "thinking" setting, exact model not reported).

**Attached:**
- `moments.csv`: the 40 moments. Columns: id, type, tick, npc (the villager deciding or reacting), other, table, key (the table row's inputs, joined by `|`), allowed answers, and the text shown to the live AIs.
- `live_answers_opus55.csv` and `live_answers_gpt6.csv`: the live answers. For room and act moments the answer is in `answer`; for reactions it is in `meaning` and `liking_change`.
- `judge_prompt.md`: the exact judge prompt. Each judge item starts with the first line of a moment's text, followed by options A, B, ….
- `judge_ratings_gpt6_and_gemini_flashlite.txt`: two judges' ratings, one block each.
- `judge_ratings_gemini_thinking.txt`: the third judge's ratings.

## What to do

**1. Check the moments are real.** Replay the run (consensus, seed 101, n 20, 30 days, decision log on). For every moment, confirm the log has a look-up at that tick, by that villager, in that table, with that key. Report how many of the 40 you find.

**2. Table and rule answers.** For each moment, give:
- the **table answer**: the consensus table's first option for that row (T2 and T4), or its `meaning` and `liking_change` (T6 and T7);
- the **rules answer**: the same, from `tables/rules`.

**3. Agreement.** Count identical answers out of 40, and separately for room (12), act (14) and reaction (14), for every pair among tables, rules, live Opus and live GPT-6. A reaction counts as identical only if both meaning and liking change match.

**4. Judging.**
- Match each judge item to its moment by the situation text, and each option to the answer it describes.
- For each source (tables, rules, live Opus, live GPT-6), take the rating given to the option that matches that source's answer. Average it over the judged moments, separately for each judge, and also for the two Gemini judges together.
- Head to head: for each other source, over the judged moments where its answer differs from the table answer, count how often its option was rated higher than, the same as, or lower than the table's option, per judge.
- Report the Pearson correlation between every pair of judges, over all rated options.

## Reply format

Tables for steps 1–4, then any decisions this prompt didn't specify. Add the script to the project, and give me `village_R5.zip`.
