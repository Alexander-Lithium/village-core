# Village Core v1.0.1: AI-filled lookup tables for believable villagers

This is the engine, data and complete reproduction package for the paper *Teaching NPCs to Think Once: AI-Filled Lookup Tables for Believable Villagers* by Alexander Lithium (2026), archived at https://doi.org/10.5281/zenodo.24211998. Contact: prosopon.dynamics@protonmail.com

An AI model fills small tables of everyday psychology **once**. Villagers then look up every choice in those tables, with **no AI running during play**. Each villager has a personality, three beliefs and relationships. What happens to it changes its beliefs, and its beliefs change how it acts. The engine is deterministic: the same tables and seed always give the same village, down to the last decision.

## Quick start

Requires Node.js 18 or later. There are no dependencies.

```
node gen_cast.js          # writes cast/cast_s1_n20.csv
node gen_rule_tables.js   # writes tables/rules/
node test.js              # 11 acceptance tests + golden hashes
node run.js --runSeed 1 --n 20 --days 30 --tableDir tables/consensus_blind8 --out results/demo
```

Expected golden hashes (rule tables, castSeed 1):

| Run | State hash | Log hash |
| --- | --- | --- |
| runSeed 1, n 20, 30 days | `f64386a9…a76d75` | `7b862fb6…18d48d9` |
| runSeed 1, n 5, 3 days | `7ae5d3c7…2b06fa1c` | `40733d27…7bc96b204` |

## Layout

| Path | Contents |
| --- | --- |
| `engine.js`, `sha256.js` | The engine: one ES module, Node or browser |
| `spec/` | The full specification (v1.0.1) and the one-shot build prompt. The engine can be rebuilt from these alone. |
| `tables/` | `rules/` (hand-written baseline), the nine teacher fills, and `consensus_blind8/` (used in Experiments 3–9) |
| `fills/` | Raw, unedited teacher replies, fill log, sealed hash of the design-chat fill, and Experiment 7 live answers and judge ratings |
| `pack/` | Teacher prompt, Experiment 7 live-AI prompt and judge prompt |
| `exp*.js`, `analyse_disagreement.js`, `compare_fills.js`, `import_fill.js` | Analysis scripts, one per experiment |
| `reports/` | Raw outputs of every experiment (JSON) |
| `figures/` | Figures and the scripts that draw them |
| `results_devices/` | Speed-test outputs from the original and replication device runs |
| `docs/experiment-log.md` | Methods, results and interpretation for every experiment |
| `replication/experiment1_build2*` | The independent engine build from Experiment 1 |
| `replication/full_reproduction/` | The blinded end-to-end reproduction: prompts R0–R8 (with R5b), attachments, every session output zip, and the replication log |

## Reproducing each experiment

| Experiment | Command |
| --- | --- |
| 2: teacher consistency | `node compare_fills.js …` and `node analyse_disagreement.js` |
| 3: spread of lives | `node exp3_spread_of_lives.js` |
| 4: one-row edit | `node exp4_one_row_edit.js` |
| 5: sensitivity | `node exp5_sensitivity.js` |
| 6: speed | `node build_speedtest.js`, then open `speedtest.html` |
| 6: acquaintance circles | `node exp6_circles.js cost 20`, or `node exp6_circles.js social` |
| 7: tables vs live AI | `node exp7_prep.js`, `node exp7_score.js`, `node exp7_judge_prep.js`, `node exp7_judge_score.js` |
| 8: suture | `node exp8_suture.js` |
| 9: long run | `node exp9_longrun.js consensus_blind8 101,102,103,104,105` |

The suture option (`suture` in the configuration) and the sensitivity settings are extensions of v1.0.1. With their defaults, every fingerprint is unchanged.

## Notes on the data

- **Self-reported model names** in the fills and judge files are unverified.
- **"i5-10500"** in one original speed-test log is a typo for i5-10400.
- **Replication speed-test file:** the block labelled "(Claude Web)" was run in Microsoft Edge (see its user agent).

## Licence

Code: MIT (`LICENSE`). Data, tables, prompts, figures and documents: CC BY 4.0 (`LICENSE-DATA.md`).
