# How to do the teacher fills

The pack has **three pastes**: Part 1 (84 rows), Part 2 (72 rows), Part 3 (84 rows). One **fill** = one chat, in which you send Part 1, wait for the reply, send Part 2, wait, then send Part 3. Paste each part exactly as written: no intro, no edits.

## The fills (arms × 2 runs)

| Arm | Where | Run 1 | Run 2 |
| --- | --- | --- | --- |
| `dev` (done) | This working session, which wrote the spec and rule tables. Sealed before any blind fill. | `dev_r1` | – |
| `opusnormal` | New ordinary chat **outside the Project**, not incognito, Opus 5.5 | `opusnormal_r1` | `opusnormal_r2` |
| `opusblind` | New **incognito** chat, Opus 5.5 | `opusblind_r1` | `opusblind_r2` |
| `gemini` | Gemini, **Temporary Chat**, free model | `gemini_r1` | `gemini_r2` |
| `chatgpt` | ChatGPT, logged in (free account), **Temporary Chat** | `chatgpt_r1` | `chatgpt_r2` |

Use the single-message pack (`teacher-pack-single.md`): paste it once and get all 240 rows back in one reply. The three-part pack is a fallback if a model can't manage one long reply. Run 2 is always a **new** chat, never a continuation of run 1. The project-informed arm was dropped (2026-11-13): someone holding the design and hypotheses has no realistic reason to try recreating an unbiased table.

## During a fill
- Don't comment, correct or nudge. If the model adds commentary, ignore it.
- If a reply stops partway, send only: `continue`
- If a reply refuses, or changes the format completely, stop and note it in the log. Don't rephrase the prompt.
- Screenshot the model name or label once per chat.

## Bringing the replies back
Either paste each reply into this chat with a label (e.g. **gemini_r1 part 2**), or save each reply as a text file named like `gemini_r1_p2.txt` and upload them. I run the importer, which reports any missing rows or words that aren't allowed.

**If the importer finds problems,** I'll give you one fixed message to send in the same chat, listing only the bad row IDs:
> Some rows were missing or used words that aren't allowed: T3-05, T9-01. Please reply with just those rows, corrected, as CSV.

Use of this fix-up message is recorded in the fill log.

## Fill log (one line per fill)
Copy `fill_log_template.csv` and fill in one row per fill. Fields:
`fill_id, date, service, plan, logged_in, mode (incognito/temporary/normal), model_label_shown, effort_or_thinking_setting, memory_or_custom_instructions_empty (y/n), continues_sent, fixup_sent, notes, screenshot_file`
