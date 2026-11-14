# Village simulation study, prompt R8 of 9: speed, cost and scale

Keep using the engine and the consensus tables. The same rules apply. This step has a part I will run on my own devices.

## Part A: a speed-test page

Build a **self-contained web page** with no network access: the engine, the consensus tables and the cast generator, all inlined. I will open it on a PC and two phones, so make it something I can open in a browser on each, for example as an artifact or a downloadable HTML file.

When I press Start, it should:
- **grow the village** through these sizes: 10, 30, 100, 300, 1,000, 3,000, 10,000, 30,000, 100,000, 300,000 and 1,000,000 villagers (consensus tables, hamlets of 20, decision log off);
- **build and time each size:** build the village (runSeed 101 + repeat number), then time whole in-game hours (`stepTick`). Keep going until at least 4 hours have been timed and at least 1.5 s has passed, or until 48 hours. Yield to the browser every 4 hours. Use 3 repeats (the median) for sizes up to 10,000, and 1 above that;
- **stop** when one in-game hour takes longer than **18.75 s** (the pace if one in-game day lasts 5 real minutes), when building takes over 30 s, or at 1,000,000;
- **skip sizes that may run out of memory:** stop before a size whose estimated memory (4.8 KB per villager) would exceed a safe limit. That limit is 1,600 MB if `navigator.deviceMemory` is 8 or more; otherwise deviceMemory × 1,024 / 5 MB (assume 4 if not reported);
- **show a table:** villagers, ms per in-game hour, µs per villager-hour, % of the 18.75 s budget used, and setup time. Also show the stop reason and basic device details (user agent, logical cores, deviceMemory, screen);
- **offer a button** that copies all results as text.

## Part B: cost (no device needed)

Compute this table from the figures below. Don't look up prices; use these as given (published list prices, November 2026, US$ per million tokens, input / output):

| Model | Input | Output |
| --- | --- | --- |
| Claude Haiku 5.5 | 0.10 | 0.50 |
| Gemini 2.5 Flash-Lite | 0.10 | 0.40 |
| Claude Sonnet 5.5 | 2 | 10 |
| Claude Opus 5.5 | 4 | 20 |
| GPT-5.5 | 5 | 30 |

- **One-time table fill:** 5,000 input and 4,000 output tokens.
- **Live AI choosing each villager's actions:** one call per villager per in-game hour, with 300 input and 20 output tokens. At one in-game day per 5 real minutes, that is 192 calls per villager per real hour.

Report, per model: the cost of one table fill; the live cost per villager per real hour; and the live cost for 1,000 villagers per real hour.

## Part C: how many people each villager knows (no device needed)

Everyone in a hamlet knows everyone else in it. Compare acquaintance circles of 20, 50 and 100 people, using hamlet sizes of 21, 51 and 101.

- **Cost:** 30,000 villagers, runSeed 101, decision log off. Measure the memory per villager after building the village (heap used after minus before, with garbage collection forced if possible). Measure the ms per in-game hour over 16 hours. Use a fresh process for each circle size.
- **Social life:** 1,000 villagers, 30 days, seeds 101–110, consensus tables, logs on. Report, as the mean over the 10 seeds:
  - friends per villager (2 × friendships ÷ villagers);
  - feuds per villager (2 × feuds ÷ villagers);
  - the % of villagers who are isolates;
  - the unkind-act share, as in R2.

## Reply format

Parts B and C as tables, then the page. I'll come back with the copied results from each device.
