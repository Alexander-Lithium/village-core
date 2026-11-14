# Teacher fill comparison

Sets: opusnormal_r1, opusnormal_r2, opusblind_r1, opusblind_r2, gemini_r1, gemini_r2, chatgpt_r1, chatgpt_r2, dev_r1
Consensus voters: opusnormal_r1, opusnormal_r2, opusblind_r1, opusblind_r2, gemini_r1, gemini_r2, chatgpt_r1, chatgpt_r2
Consensus written to tables/consensus_blind8

## Row agreement with the consensus (whole row identical)

| Set | T2 action | T3 stance | T4 act | T5 apology | T6 appraise_trust | T7 appraise_worth | T8 appraise_effort | T9 mood | T10 grudge | T12 compile | All |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| opusnormal_r1 | 100% | 94% | 75% | 100% | 83% | 80% | 67% | 92% | 92% | 89% | 86% |
| opusnormal_r2 | 93% | 100% | 79% | 89% | 78% | 74% | 67% | 92% | 83% | 89% | 84% |
| opusblind_r1 | 93% | 100% | 75% | 89% | 81% | 83% | 75% | 92% | 92% | 72% | 85% |
| opusblind_r2 | 89% | 94% | 83% | 89% | 94% | 72% | 75% | 100% | 100% | 83% | 86% |
| gemini_r1 | 93% | 89% | 67% | 100% | 86% | 83% | 83% | 100% | 92% | 61% | 84% |
| gemini_r2 | 89% | 97% | 67% | 100% | 78% | 85% | 100% | 100% | 92% | 61% | 85% |
| chatgpt_r1 | 74% | 86% | 46% | 89% | 56% | 56% | 42% | 100% | 75% | 61% | 65% |
| chatgpt_r2 | 74% | 81% | 63% | 100% | 72% | 57% | 67% | 100% | 75% | 61% | 71% |
| dev_r1 *(not voting)* | 81% | 97% | 50% | 100% | 72% | 67% | 67% | 92% | 92% | 56% | 75% |
| rules *(not voting)* | 52% | 69% | 25% | 89% | 64% | 61% | 75% | 100% | 92% | 44% | 62% |

## Self-consistency (run 1 vs run 2 of the same arm)

| Arm | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T12 | All |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| opusnormal | 93% | 94% | 71% | 89% | 86% | 83% | 67% | 100% | 92% | 89% | 86% |
| opusblind | 93% | 94% | 83% | 78% | 83% | 83% | 100% | 92% | 92% | 56% | 85% |
| gemini | 89% | 92% | 88% | 100% | 83% | 93% | 83% | 100% | 100% | 94% | 91% |
| chatgpt | 70% | 83% | 29% | 89% | 69% | 57% | 50% | 100% | 67% | 72% | 66% |

## Pairwise agreement (all 240 rows)

| | opusnormal_r1 | opusnormal_r2 | opusblind_r1 | opusblind_r2 | gemini_r1 | gemini_r2 | chatgpt_r1 | chatgpt_r2 | dev_r1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| opusnormal_r1 | 100% | 86% | 86% | 85% | 78% | 76% | 61% | 66% | 76% |
| opusnormal_r2 | 86% | 100% | 86% | 83% | 76% | 74% | 60% | 67% | 75% |
| opusblind_r1 | 86% | 86% | 100% | 85% | 78% | 77% | 58% | 68% | 74% |
| opusblind_r2 | 85% | 83% | 85% | 100% | 73% | 73% | 61% | 65% | 75% |
| gemini_r1 | 78% | 76% | 78% | 73% | 100% | 91% | 60% | 68% | 72% |
| gemini_r2 | 76% | 74% | 77% | 73% | 91% | 100% | 60% | 70% | 72% |
| chatgpt_r1 | 61% | 60% | 58% | 61% | 60% | 60% | 100% | 66% | 60% |
| chatgpt_r2 | 66% | 67% | 68% | 65% | 68% | 70% | 66% | 100% | 61% |
| dev_r1 | 76% | 75% | 74% | 75% | 72% | 72% | 60% | 61% | 100% |

## Consensus ties (27)
- T2 eat|mid|low · second: home / field → home
- T4 friendly|field|low · first: help / chat → help
- T4 friendly|square|high · first: chat / share food → chat
- T4 neutral|field|low · second: take credit / chat → chat
- T6 argued with|people mean well|held · meaning: slight / insult → slight
- T6 argued with|people mean well|core · pressure: same / strained → strained
- T6 interrupted|people mean well|held · meaning: nothing much / slight → slight
- T6 apologised to|people are against me|held · meaning: nothing much / good sign → nothing much
- T6 apologised to|people are against me|held · liking_change: same / up → same
- T7 praised|i am respected|held|high · meaning: nothing much / good sign → good sign
- T7 praised|i am respected|held|high · pressure: same / stronger → stronger
- T7 praised|i am overlooked|held|high · liking_change: same / up → same
- T7 praised|i am overlooked|core|low · meaning: good sign / nothing much → nothing much
- T7 praised|i am overlooked|core|high · meaning: nothing much / good sign → nothing much
- T7 praised|i am overlooked|core|high · pressure: same / strained → strained
- T7 ignored|i am respected|faint|low · pressure: same / weaker → weaker
- T7 ignored|i am respected|held|mid · pressure: same / weaker → weaker
- T7 ignored|i am overlooked|core|low · meaning: nothing much / slight → slight
- T7 credit taken|i am respected|held|low · pressure: same / weaker → weaker
- T8 work went well|nothing i do matters|core · pressure: same / strained → strained
- T8 work went badly|hard work pays off|held · pressure: same / weaker → weaker
- T8 work went badly|hard work pays off|core · pressure: same / strained → strained
- T10 low|slight|none · response: cool off / hold grudge → hold grudge
- T12 people mean well|held · sociability: 0 / +1 → 0
- T12 hard work pays off|faint · diligence: 0 / +1 → 0
- T12 nothing i do matters|faint · diligence: 0 / -1 → 0
- T12 nothing i do matters|core · warmth: 0 / -1 → 0

## Rows that differ between runs of the same arm (171)
- opusnormal · T2 eat|mid|low: home/home vs home/field
- opusnormal · T2 rest|high|high: home/square vs home/field
- opusnormal · T3 mid|dislike|low: cold vs hostile
- opusnormal · T3 mid|neutral|low: neutral vs cold
- opusnormal · T4 friendly|field|low: help/chat vs help/take credit
- opusnormal · T4 friendly|field|high: help/help vs help/chat
- opusnormal · T4 friendly|square|high: chat/share food vs share food/chat
- opusnormal · T4 neutral|field|low: chat/take credit vs take credit/chat
- opusnormal · T4 neutral|square|high: chat/chat vs chat/praise
- opusnormal · T4 cold|square|mid: ignore/chat vs ignore/interrupt
- opusnormal · T4 hostile|square|mid: argue/ignore vs argue/interrupt
- opusnormal · T5 high|high: apologise vs don't
- opusnormal · T6 helped|people are against me|held: good sign/weaker/up vs nothing much/weaker/up
- opusnormal · T6 chatted with|people mean well|held: good sign/stronger/up vs nothing much/same/up
- opusnormal · T6 chatted with|people mean well|core: good sign/same/up vs nothing much/same/up
- opusnormal · T6 argued with|people mean well|held: slight/weaker/down vs slight/same/down
- opusnormal · T6 interrupted|people mean well|faint: slight/weaker/down vs slight/same/down
- opusnormal · T7 praised|i am overlooked|core|low: good sign/strained/up vs nothing much/same/same
- opusnormal · T7 praised|i am overlooked|core|mid: nothing much/same/same vs good sign/strained/up
- opusnormal · T7 praised|i am overlooked|core|high: slight/same/down vs nothing much/same/same
- opusnormal · T7 ignored|i am respected|faint|high: slight/weaker/down vs insult/weaker/down
- opusnormal · T7 ignored|i am respected|held|high: insult/weaker/down vs insult/same/down
- opusnormal · T7 ignored|i am respected|core|high: insult/strained/down vs insult/same/down
- opusnormal · T7 ignored|i am overlooked|faint|low: nothing much/stronger/same vs nothing much/same/same
- opusnormal · T7 credit taken|i am respected|held|high: insult/weaker/down vs insult/same/down
- opusnormal · T7 credit taken|i am respected|core|mid: insult/strained/down vs insult/same/down
- opusnormal · T8 work went badly|hard work pays off|held: slight/same vs nothing much/same
- opusnormal · T8 work went badly|hard work pays off|core: slight/same vs nothing much/same
- opusnormal · T8 work went badly|nothing i do matters|held: nothing much/stronger vs slight/stronger
- opusnormal · T8 work went badly|nothing i do matters|core: nothing much/same vs slight/same
- opusnormal · T10 low|slight|received: cool off vs let it go
- opusnormal · T12 people are against me|faint: 0/-1/0/0 vs 0/0/0/0
- opusnormal · T12 nothing i do matters|core: 0/-1/-1/0 vs 0/-1/-1/-1
- opusblind · T2 rest|high|mid: home/field vs home/home
- opusblind · T2 rest|high|high: home/field vs home/home
- opusblind · T3 mid|dislike|low: hostile vs cold
- opusblind · T3 mid|neutral|low: cold vs neutral
- opusblind · T4 friendly|field|low: chat/help vs help/take credit
- opusblind · T4 friendly|square|high: chat/share food vs chat/praise
- opusblind · T4 cold|field|high: chat/argue vs chat/help
- opusblind · T4 cold|square|high: chat/ignore vs ignore/chat
- opusblind · T5 low|low: don't vs apologise
- opusblind · T5 high|high: don't vs apologise
- opusblind · T6 chatted with|people mean well|faint: nothing much/stronger/up vs good sign/stronger/up
- opusblind · T6 argued with|people mean well|faint: slight/weaker/down vs insult/weaker/down
- opusblind · T6 argued with|people mean well|held: slight/same/down vs slight/weaker/down
- opusblind · T6 argued with|people mean well|core: slight/same/same vs slight/same/down
- opusblind · T6 interrupted|people mean well|faint: slight/same/down vs slight/weaker/down
- opusblind · T6 interrupted|people mean well|held: nothing much/same/same vs slight/same/same
- opusblind · T7 praised|i am respected|held|high: nothing much/same/same vs good sign/stronger/up
- opusblind · T7 praised|i am respected|core|high: nothing much/same/same vs nothing much/same/up
- opusblind · T7 ignored|i am respected|faint|high: insult/weaker/down vs slight/weaker/down
- opusblind · T7 ignored|i am respected|held|mid: slight/same/down vs nothing much/same/same
- opusblind · T7 ignored|i am respected|held|high: insult/weaker/down vs slight/same/down
- opusblind · T7 ignored|i am respected|core|mid: slight/same/down vs nothing much/same/same
- opusblind · T7 ignored|i am respected|core|high: insult/strained/down vs insult/same/down
- opusblind · T7 credit taken|i am respected|held|mid: insult/weaker/down vs insult/same/down
- opusblind · T7 credit taken|i am respected|held|high: insult/weaker/down vs insult/same/down
- opusblind · T9 calm|slight: calm vs low
- opusblind · T10 low|slight|received: let it go vs cool off
- opusblind · T12 people are against me|faint: 0/-1/0/0 vs 0/0/0/0
- opusblind · T12 i am respected|faint: 0/0/0/+1 vs 0/0/0/0
- opusblind · T12 i am overlooked|faint: 0/-1/0/0 vs 0/0/0/0
- opusblind · T12 i am overlooked|held: 0/-1/0/-1 vs 0/-1/0/0
- opusblind · T12 hard work pays off|faint: 0/0/+1/0 vs 0/0/0/0
- opusblind · T12 nothing i do matters|faint: 0/0/-1/0 vs 0/0/0/0
- opusblind · T12 nothing i do matters|held: 0/-1/-1/0 vs 0/0/-1/0
- opusblind · T12 nothing i do matters|core: -1/-1/-1/-1 vs 0/-1/-1/-1
- gemini · T2 none|low|high: square/square vs square/field
- gemini · T2 eat|high|high: home/field vs home/square
- gemini · T2 rest|high|high: home/field vs home/square
- gemini · T3 low|dislike|calm: hostile vs cold
- gemini · T3 mid|dislike|good: cold vs neutral
- gemini · T3 high|dislike|calm: cold vs neutral
- gemini · T4 neutral|square|low: chat/interrupt vs interrupt/chat
- gemini · T4 neutral|square|high: chat/share food vs chat/praise
- gemini · T4 hostile|field|mid: argue/take credit vs argue/argue
- gemini · T6 helped|people are against me|held: nothing much/weaker/up vs nothing much/weaker/same
- gemini · T6 shared food with|people are against me|core: nothing much/strained/up vs nothing much/strained/same
- gemini · T6 argued with|people mean well|core: slight/strained/down vs insult/strained/down
- gemini · T6 interrupted|people mean well|faint: slight/weaker/down vs nothing much/same/same
- gemini · T6 interrupted|people mean well|held: nothing much/same/same vs slight/weaker/down
- gemini · T6 interrupted|people mean well|core: nothing much/same/same vs slight/same/down
- gemini · T7 praised|i am respected|held|high: nothing much/same/up vs good sign/stronger/up
- gemini · T7 praised|i am respected|core|mid: nothing much/same/up vs good sign/same/up
- gemini · T7 praised|i am overlooked|core|mid: nothing much/same/same vs nothing much/strained/same
- gemini · T7 credit taken|i am overlooked|held|low: slight/stronger/down vs insult/stronger/down
- gemini · T8 work went badly|hard work pays off|core: nothing much/strained vs slight/strained
- gemini · T8 work went badly|nothing i do matters|core: slight/same vs nothing much/same
- gemini · T12 people are against me|core: -1/-1/-1/+1 vs -1/-1/-1/0
- chatgpt · T2 none|low|mid: home/square vs square/home
- chatgpt · T2 none|mid|mid: field/home vs field/square
- chatgpt · T2 eat|low|mid: home/home vs home/square
- chatgpt · T2 eat|mid|low: home/home vs home/field
- chatgpt · T2 eat|mid|mid: home/home vs home/field
- chatgpt · T2 eat|high|high: home/field vs home/square
- chatgpt · T2 rest|mid|low: home/home vs home/field
- chatgpt · T2 rest|mid|mid: home/home vs home/square
- chatgpt · T3 low|dislike|calm: hostile vs cold
- chatgpt · T3 low|close|low: neutral vs cold
- chatgpt · T3 mid|close|low: friendly vs neutral
- chatgpt · T3 high|neutral|low: neutral vs cold
- chatgpt · T3 high|neutral|calm: neutral vs friendly
- chatgpt · T3 high|like|low: friendly vs neutral
- chatgpt · T4 friendly|field|low: chat/help vs help/take credit
- chatgpt · T4 friendly|square|low: share food/share food vs chat/interrupt
- chatgpt · T4 friendly|square|high: chat/praise vs share food/praise
- chatgpt · T4 neutral|field|low: chat/chat vs chat/take credit
- chatgpt · T4 neutral|field|mid: chat/chat vs chat/help
- chatgpt · T4 neutral|field|high: chat/help vs help/chat
- chatgpt · T4 neutral|square|low: chat/ignore vs ignore/chat
- chatgpt · T4 neutral|square|mid: chat/praise vs chat/ignore
- chatgpt · T4 cold|field|mid: take credit/argue vs argue/chat
- chatgpt · T4 cold|field|high: chat/help vs chat/argue
- chatgpt · T4 cold|square|low: ignore/interrupt vs ignore/argue
- chatgpt · T4 cold|square|mid: ignore/argue vs ignore/interrupt
- chatgpt · T4 cold|square|high: chat/argue vs chat/ignore
- chatgpt · T4 hostile|field|high: argue/take credit vs argue/chat
- chatgpt · T4 hostile|square|low: interrupt/ignore vs argue/interrupt
- chatgpt · T4 hostile|square|mid: argue/interrupt vs argue/ignore
- chatgpt · T4 hostile|square|high: argue/interrupt vs argue/ignore
- chatgpt · T5 mid|mid: don't vs apologise
- chatgpt · T6 chatted with|people mean well|faint: nothing much/same/same vs good sign/stronger/up
- chatgpt · T6 chatted with|people mean well|held: nothing much/same/same vs nothing much/same/up
- chatgpt · T6 chatted with|people mean well|core: nothing much/same/same vs nothing much/same/up
- chatgpt · T6 argued with|people are against me|faint: good sign/stronger/down vs insult/stronger/down
- chatgpt · T6 argued with|people are against me|held: good sign/stronger/down vs insult/stronger/down
- chatgpt · T6 argued with|people are against me|core: good sign/same/down vs insult/same/down
- chatgpt · T6 interrupted|people mean well|held: slight/weaker/down vs slight/same/down
- chatgpt · T6 interrupted|people mean well|core: slight/strained/down vs slight/same/down
- chatgpt · T6 interrupted|people are against me|faint: slight/stronger/same vs slight/stronger/down
- chatgpt · T6 interrupted|people are against me|held: slight/stronger/same vs slight/stronger/down
- chatgpt · T6 interrupted|people are against me|core: slight/same/same vs slight/same/down
- chatgpt · T7 praised|i am overlooked|faint|low: nothing much/weaker/up vs good sign/weaker/up
- chatgpt · T7 praised|i am overlooked|faint|mid: slight/weaker/up vs good sign/weaker/up
- chatgpt · T7 praised|i am overlooked|faint|high: slight/weaker/up vs good sign/weaker/up
- chatgpt · T7 praised|i am overlooked|held|low: nothing much/weaker/up vs good sign/weaker/up
- chatgpt · T7 praised|i am overlooked|held|mid: slight/weaker/up vs good sign/weaker/up
- chatgpt · T7 praised|i am overlooked|held|high: slight/weaker/up vs good sign/weaker/up
- chatgpt · T7 praised|i am overlooked|core|low: nothing much/strained/up vs good sign/strained/up
- chatgpt · T7 praised|i am overlooked|core|mid: slight/strained/up vs good sign/strained/up
- chatgpt · T7 praised|i am overlooked|core|high: slight/strained/up vs good sign/strained/up
- chatgpt · T7 ignored|i am respected|faint|high: slight/weaker/down vs insult/weaker/down
- chatgpt · T7 ignored|i am respected|held|high: slight/weaker/down vs insult/weaker/down
- chatgpt · T7 ignored|i am respected|core|high: slight/strained/down vs insult/strained/down
- chatgpt · T7 ignored|i am overlooked|faint|low: nothing much/stronger/same vs nothing much/same/same
- chatgpt · T7 ignored|i am overlooked|faint|mid: insult/stronger/same vs nothing much/same/same
- chatgpt · T7 ignored|i am overlooked|faint|high: insult/stronger/down vs slight/same/down
- chatgpt · T7 ignored|i am overlooked|held|low: nothing much/stronger/same vs nothing much/same/same
- chatgpt · T7 ignored|i am overlooked|held|mid: insult/stronger/same vs nothing much/same/same
- chatgpt · T7 ignored|i am overlooked|held|high: insult/stronger/down vs slight/same/down
- chatgpt · T7 ignored|i am overlooked|core|mid: insult/same/same vs nothing much/same/same
- chatgpt · T7 ignored|i am overlooked|core|high: insult/same/down vs slight/same/down
- chatgpt · T7 credit taken|i am overlooked|faint|low: slight/stronger/down vs insult/stronger/down
- chatgpt · T7 credit taken|i am overlooked|held|low: slight/stronger/down vs insult/stronger/down
- chatgpt · T7 credit taken|i am overlooked|core|low: slight/same/down vs insult/same/down
- chatgpt · T8 work went badly|hard work pays off|faint: insult/weaker vs slight/weaker
- chatgpt · T8 work went badly|hard work pays off|held: insult/weaker vs slight/weaker
- chatgpt · T8 work went badly|hard work pays off|core: insult/strained vs slight/strained
- chatgpt · T8 work went badly|nothing i do matters|faint: insult/stronger vs good sign/stronger
- chatgpt · T8 work went badly|nothing i do matters|held: insult/stronger vs good sign/stronger
- chatgpt · T8 work went badly|nothing i do matters|core: insult/same vs good sign/same
- chatgpt · T10 low|slight|received: cool off vs let it go
- chatgpt · T10 low|insult|received: cool off vs hold grudge
- chatgpt · T10 mid|slight|none: let it go vs cool off
- chatgpt · T10 high|insult|none: hold grudge vs cool off
- chatgpt · T12 people are against me|faint: 0/0/0/0 vs 0/-1/0/0
- chatgpt · T12 hard work pays off|faint: 0/0/0/0 vs 0/0/+1/0
- chatgpt · T12 nothing i do matters|faint: 0/0/0/0 vs 0/0/-1/0
- chatgpt · T12 nothing i do matters|held: -1/-1/-1/-1 vs 0/-1/-1/-1
- chatgpt · T12 nothing i do matters|core: -1/-1/-1/-1 vs 0/-1/-1/-1

## Rows where not all sets agree (142 of 240)
<details><summary>show</summary>

- T2 none|low|low: opusnormal_r1=home/field, opusnormal_r2=home/field, opusblind_r1=home/field, opusblind_r2=home/field, gemini_r1=home/square, gemini_r2=home/square, chatgpt_r1=home/field, chatgpt_r2=home/field, dev_r1=home/field
- T2 none|low|mid: opusnormal_r1=square/home, opusnormal_r2=square/home, opusblind_r1=square/home, opusblind_r2=square/home, gemini_r1=square/home, gemini_r2=square/home, chatgpt_r1=home/square, chatgpt_r2=square/home, dev_r1=square/home
- T2 none|low|high: opusnormal_r1=square/square, opusnormal_r2=square/square, opusblind_r1=square/square, opusblind_r2=square/square, gemini_r1=square/square, gemini_r2=square/field, chatgpt_r1=square/home, chatgpt_r2=square/home, dev_r1=square/home
- T2 none|mid|mid: opusnormal_r1=field/square, opusnormal_r2=field/square, opusblind_r1=field/square, opusblind_r2=field/square, gemini_r1=field/square, gemini_r2=field/square, chatgpt_r1=field/home, chatgpt_r2=field/square, dev_r1=field/square
- T2 none|high|low: opusnormal_r1=field/field, opusnormal_r2=field/field, opusblind_r1=field/field, opusblind_r2=field/field, gemini_r1=field/field, gemini_r2=field/field, chatgpt_r1=field/home, chatgpt_r2=field/home, dev_r1=field/field
- T2 eat|low|mid: opusnormal_r1=home/square, opusnormal_r2=home/square, opusblind_r1=home/square, opusblind_r2=home/square, gemini_r1=home/square, gemini_r2=home/square, chatgpt_r1=home/home, chatgpt_r2=home/square, dev_r1=home/square
- T2 eat|mid|low: opusnormal_r1=home/home, opusnormal_r2=home/field, opusblind_r1=home/field, opusblind_r2=home/field, gemini_r1=home/home, gemini_r2=home/home, chatgpt_r1=home/home, chatgpt_r2=home/field, dev_r1=home/field
- T2 eat|mid|mid: opusnormal_r1=home/field, opusnormal_r2=home/field, opusblind_r1=home/field, opusblind_r2=home/field, gemini_r1=home/field, gemini_r2=home/field, chatgpt_r1=home/home, chatgpt_r2=home/field, dev_r1=home/square
- T2 eat|high|high: opusnormal_r1=home/field, opusnormal_r2=home/field, opusblind_r1=home/field, opusblind_r2=home/field, gemini_r1=home/field, gemini_r2=home/square, chatgpt_r1=home/field, chatgpt_r2=home/square, dev_r1=home/field
- T2 rest|low|mid: opusnormal_r1=home/home, opusnormal_r2=home/home, opusblind_r1=home/home, opusblind_r2=home/home, gemini_r1=home/home, gemini_r2=home/home, chatgpt_r1=home/square, chatgpt_r2=home/square, dev_r1=home/home
- T2 rest|mid|low: opusnormal_r1=home/home, opusnormal_r2=home/home, opusblind_r1=home/home, opusblind_r2=home/home, gemini_r1=home/home, gemini_r2=home/home, chatgpt_r1=home/home, chatgpt_r2=home/field, dev_r1=home/home
- T2 rest|mid|mid: opusnormal_r1=home/home, opusnormal_r2=home/home, opusblind_r1=home/home, opusblind_r2=home/home, gemini_r1=home/home, gemini_r2=home/home, chatgpt_r1=home/home, chatgpt_r2=home/square, dev_r1=home/field
- T2 rest|high|mid: opusnormal_r1=home/field, opusnormal_r2=home/field, opusblind_r1=home/field, opusblind_r2=home/home, gemini_r1=home/field, gemini_r2=home/field, chatgpt_r1=home/field, chatgpt_r2=home/field, dev_r1=home/field
- T2 rest|high|high: opusnormal_r1=home/square, opusnormal_r2=home/field, opusblind_r1=home/field, opusblind_r2=home/home, gemini_r1=home/field, gemini_r2=home/square, chatgpt_r1=home/square, chatgpt_r2=home/square, dev_r1=home/field
- T3 low|dislike|calm: opusnormal_r1=cold, opusnormal_r2=cold, opusblind_r1=cold, opusblind_r2=cold, gemini_r1=hostile, gemini_r2=cold, chatgpt_r1=hostile, chatgpt_r2=cold, dev_r1=cold
- T3 low|neutral|calm: opusnormal_r1=neutral, opusnormal_r2=neutral, opusblind_r1=neutral, opusblind_r2=neutral, gemini_r1=cold, gemini_r2=cold, chatgpt_r1=neutral, chatgpt_r2=neutral, dev_r1=neutral
- T3 low|like|low: opusnormal_r1=neutral, opusnormal_r2=neutral, opusblind_r1=neutral, opusblind_r2=neutral, gemini_r1=neutral, gemini_r2=neutral, chatgpt_r1=cold, chatgpt_r2=cold, dev_r1=neutral
- T3 low|close|low: opusnormal_r1=neutral, opusnormal_r2=neutral, opusblind_r1=neutral, opusblind_r2=neutral, gemini_r1=neutral, gemini_r2=neutral, chatgpt_r1=neutral, chatgpt_r2=cold, dev_r1=neutral
- T3 mid|dislike|low: opusnormal_r1=cold, opusnormal_r2=hostile, opusblind_r1=hostile, opusblind_r2=cold, gemini_r1=hostile, gemini_r2=hostile, chatgpt_r1=hostile, chatgpt_r2=hostile, dev_r1=hostile
- T3 mid|dislike|good: opusnormal_r1=neutral, opusnormal_r2=neutral, opusblind_r1=neutral, opusblind_r2=neutral, gemini_r1=cold, gemini_r2=neutral, chatgpt_r1=cold, chatgpt_r2=cold, dev_r1=cold
- T3 mid|neutral|low: opusnormal_r1=neutral, opusnormal_r2=cold, opusblind_r1=cold, opusblind_r2=neutral, gemini_r1=cold, gemini_r2=cold, chatgpt_r1=cold, chatgpt_r2=cold, dev_r1=cold
- T3 mid|close|low: opusnormal_r1=friendly, opusnormal_r2=friendly, opusblind_r1=friendly, opusblind_r2=friendly, gemini_r1=friendly, gemini_r2=friendly, chatgpt_r1=friendly, chatgpt_r2=neutral, dev_r1=friendly
- T3 high|dislike|calm: opusnormal_r1=neutral, opusnormal_r2=neutral, opusblind_r1=neutral, opusblind_r2=neutral, gemini_r1=cold, gemini_r2=neutral, chatgpt_r1=cold, chatgpt_r2=cold, dev_r1=neutral
- T3 high|neutral|low: opusnormal_r1=neutral, opusnormal_r2=neutral, opusblind_r1=neutral, opusblind_r2=neutral, gemini_r1=neutral, gemini_r2=neutral, chatgpt_r1=neutral, chatgpt_r2=cold, dev_r1=neutral
- T3 high|neutral|calm: opusnormal_r1=friendly, opusnormal_r2=friendly, opusblind_r1=friendly, opusblind_r2=friendly, gemini_r1=friendly, gemini_r2=friendly, chatgpt_r1=neutral, chatgpt_r2=friendly, dev_r1=friendly
- T3 high|like|low: opusnormal_r1=friendly, opusnormal_r2=friendly, opusblind_r1=friendly, opusblind_r2=friendly, gemini_r1=friendly, gemini_r2=friendly, chatgpt_r1=friendly, chatgpt_r2=neutral, dev_r1=friendly
- T4 friendly|field|low: opusnormal_r1=help/chat, opusnormal_r2=help/take credit, opusblind_r1=chat/help, opusblind_r2=help/take credit, gemini_r1=chat/take credit, gemini_r2=chat/take credit, chatgpt_r1=chat/help, chatgpt_r2=help/take credit, dev_r1=help/chat
- T4 friendly|field|high: opusnormal_r1=help/help, opusnormal_r2=help/chat, opusblind_r1=help/help, opusblind_r2=help/help, gemini_r1=help/chat, gemini_r2=help/chat, chatgpt_r1=help/chat, chatgpt_r2=help/chat, dev_r1=help/chat
- T4 friendly|square|low: opusnormal_r1=chat/praise, opusnormal_r2=chat/praise, opusblind_r1=chat/praise, opusblind_r2=chat/praise, gemini_r1=chat/praise, gemini_r2=chat/praise, chatgpt_r1=share food/share food, chatgpt_r2=chat/interrupt, dev_r1=chat/share food
- T4 friendly|square|mid: opusnormal_r1=chat/share food, opusnormal_r2=chat/share food, opusblind_r1=chat/share food, opusblind_r2=chat/share food, gemini_r1=chat/share food, gemini_r2=chat/share food, chatgpt_r1=chat/share food, chatgpt_r2=chat/share food, dev_r1=chat/praise
- T4 friendly|square|high: opusnormal_r1=chat/share food, opusnormal_r2=share food/chat, opusblind_r1=chat/share food, opusblind_r2=chat/praise, gemini_r1=share food/praise, gemini_r2=share food/praise, chatgpt_r1=chat/praise, chatgpt_r2=share food/praise, dev_r1=praise/share food
- T4 neutral|field|low: opusnormal_r1=chat/take credit, opusnormal_r2=take credit/chat, opusblind_r1=chat/take credit, opusblind_r2=chat/take credit, gemini_r1=take credit/chat, gemini_r2=take credit/chat, chatgpt_r1=chat/chat, chatgpt_r2=chat/take credit, dev_r1=chat/take credit
- T4 neutral|field|mid: opusnormal_r1=chat/help, opusnormal_r2=chat/help, opusblind_r1=chat/help, opusblind_r2=chat/help, gemini_r1=chat/help, gemini_r2=chat/help, chatgpt_r1=chat/chat, chatgpt_r2=chat/help, dev_r1=chat/help
- T4 neutral|field|high: opusnormal_r1=help/chat, opusnormal_r2=help/chat, opusblind_r1=help/chat, opusblind_r2=help/chat, gemini_r1=chat/help, gemini_r2=chat/help, chatgpt_r1=chat/help, chatgpt_r2=help/chat, dev_r1=chat/help
- T4 neutral|square|low: opusnormal_r1=chat/ignore, opusnormal_r2=chat/ignore, opusblind_r1=chat/ignore, opusblind_r2=chat/ignore, gemini_r1=chat/interrupt, gemini_r2=interrupt/chat, chatgpt_r1=chat/ignore, chatgpt_r2=ignore/chat, dev_r1=chat/ignore
- T4 neutral|square|mid: opusnormal_r1=chat/ignore, opusnormal_r2=chat/ignore, opusblind_r1=chat/ignore, opusblind_r2=chat/ignore, gemini_r1=chat/ignore, gemini_r2=chat/ignore, chatgpt_r1=chat/praise, chatgpt_r2=chat/ignore, dev_r1=chat/ignore
- T4 neutral|square|high: opusnormal_r1=chat/chat, opusnormal_r2=chat/praise, opusblind_r1=chat/chat, opusblind_r2=chat/chat, gemini_r1=chat/share food, gemini_r2=chat/praise, chatgpt_r1=chat/praise, chatgpt_r2=chat/praise, dev_r1=chat/praise
- T4 cold|field|low: opusnormal_r1=take credit/argue, opusnormal_r2=take credit/argue, opusblind_r1=take credit/argue, opusblind_r2=take credit/argue, gemini_r1=take credit/argue, gemini_r2=take credit/argue, chatgpt_r1=take credit/argue, chatgpt_r2=take credit/argue, dev_r1=take credit/chat
- T4 cold|field|mid: opusnormal_r1=chat/argue, opusnormal_r2=chat/argue, opusblind_r1=chat/argue, opusblind_r2=chat/argue, gemini_r1=argue/chat, gemini_r2=argue/chat, chatgpt_r1=take credit/argue, chatgpt_r2=argue/chat, dev_r1=chat/argue
- T4 cold|field|high: opusnormal_r1=chat/argue, opusnormal_r2=chat/argue, opusblind_r1=chat/argue, opusblind_r2=chat/help, gemini_r1=chat/argue, gemini_r2=chat/argue, chatgpt_r1=chat/help, chatgpt_r2=chat/argue, dev_r1=chat/chat
- T4 cold|square|low: opusnormal_r1=ignore/interrupt, opusnormal_r2=ignore/interrupt, opusblind_r1=ignore/interrupt, opusblind_r2=ignore/interrupt, gemini_r1=ignore/interrupt, gemini_r2=ignore/interrupt, chatgpt_r1=ignore/interrupt, chatgpt_r2=ignore/argue, dev_r1=ignore/interrupt
- T4 cold|square|mid: opusnormal_r1=ignore/chat, opusnormal_r2=ignore/interrupt, opusblind_r1=ignore/chat, opusblind_r2=ignore/chat, gemini_r1=ignore/chat, gemini_r2=ignore/chat, chatgpt_r1=ignore/argue, chatgpt_r2=ignore/interrupt, dev_r1=ignore/chat
- T4 cold|square|high: opusnormal_r1=ignore/chat, opusnormal_r2=ignore/chat, opusblind_r1=chat/ignore, opusblind_r2=ignore/chat, gemini_r1=ignore/chat, gemini_r2=ignore/chat, chatgpt_r1=chat/argue, chatgpt_r2=chat/ignore, dev_r1=chat/ignore
- T4 hostile|field|low: opusnormal_r1=take credit/argue, opusnormal_r2=take credit/argue, opusblind_r1=take credit/argue, opusblind_r2=take credit/argue, gemini_r1=argue/take credit, gemini_r2=argue/take credit, chatgpt_r1=take credit/argue, chatgpt_r2=take credit/argue, dev_r1=take credit/argue
- T4 hostile|field|mid: opusnormal_r1=argue/take credit, opusnormal_r2=argue/take credit, opusblind_r1=argue/take credit, opusblind_r2=argue/take credit, gemini_r1=argue/take credit, gemini_r2=argue/argue, chatgpt_r1=argue/take credit, chatgpt_r2=argue/take credit, dev_r1=argue/chat
- T4 hostile|field|high: opusnormal_r1=argue/argue, opusnormal_r2=argue/argue, opusblind_r1=argue/argue, opusblind_r2=argue/argue, gemini_r1=argue/argue, gemini_r2=argue/argue, chatgpt_r1=argue/take credit, chatgpt_r2=argue/chat, dev_r1=argue/chat
- T4 hostile|square|low: opusnormal_r1=interrupt/argue, opusnormal_r2=interrupt/argue, opusblind_r1=argue/interrupt, opusblind_r2=argue/interrupt, gemini_r1=argue/interrupt, gemini_r2=argue/interrupt, chatgpt_r1=interrupt/ignore, chatgpt_r2=argue/interrupt, dev_r1=argue/interrupt
- T4 hostile|square|mid: opusnormal_r1=argue/ignore, opusnormal_r2=argue/interrupt, opusblind_r1=argue/ignore, opusblind_r2=argue/ignore, gemini_r1=argue/ignore, gemini_r2=argue/ignore, chatgpt_r1=argue/interrupt, chatgpt_r2=argue/ignore, dev_r1=argue/ignore
- T4 hostile|square|high: opusnormal_r1=argue/ignore, opusnormal_r2=argue/ignore, opusblind_r1=argue/ignore, opusblind_r2=argue/ignore, gemini_r1=argue/ignore, gemini_r2=argue/ignore, chatgpt_r1=argue/interrupt, chatgpt_r2=argue/ignore, dev_r1=ignore/argue
- T5 low|low: opusnormal_r1=don't, opusnormal_r2=don't, opusblind_r1=don't, opusblind_r2=apologise, gemini_r1=don't, gemini_r2=don't, chatgpt_r1=don't, chatgpt_r2=don't, dev_r1=don't
- T5 mid|mid: opusnormal_r1=apologise, opusnormal_r2=apologise, opusblind_r1=apologise, opusblind_r2=apologise, gemini_r1=apologise, gemini_r2=apologise, chatgpt_r1=don't, chatgpt_r2=apologise, dev_r1=apologise
- T5 high|high: opusnormal_r1=apologise, opusnormal_r2=don't, opusblind_r1=don't, opusblind_r2=apologise, gemini_r1=apologise, gemini_r2=apologise, chatgpt_r1=apologise, chatgpt_r2=apologise, dev_r1=apologise
- T6 helped|people are against me|held: opusnormal_r1=good sign/weaker/up, opusnormal_r2=nothing much/weaker/up, opusblind_r1=good sign/weaker/up, opusblind_r2=good sign/weaker/up, gemini_r1=nothing much/weaker/up, gemini_r2=nothing much/weaker/same, chatgpt_r1=good sign/weaker/up, chatgpt_r2=good sign/weaker/up, dev_r1=nothing much/weaker/same
- T6 helped|people are against me|core: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=nothing much/same/same, opusblind_r2=nothing much/same/same, gemini_r1=nothing much/same/same, gemini_r2=nothing much/same/same, chatgpt_r1=good sign/strained/up, chatgpt_r2=good sign/strained/up, dev_r1=nothing much/same/same
- T6 chatted with|people mean well|faint: opusnormal_r1=good sign/stronger/up, opusnormal_r2=good sign/stronger/up, opusblind_r1=nothing much/stronger/up, opusblind_r2=good sign/stronger/up, gemini_r1=good sign/stronger/up, gemini_r2=good sign/stronger/up, chatgpt_r1=nothing much/same/same, chatgpt_r2=good sign/stronger/up, dev_r1=nothing much/same/same
- T6 chatted with|people mean well|held: opusnormal_r1=good sign/stronger/up, opusnormal_r2=nothing much/same/up, opusblind_r1=nothing much/same/up, opusblind_r2=nothing much/same/up, gemini_r1=nothing much/same/same, gemini_r2=nothing much/same/same, chatgpt_r1=nothing much/same/same, chatgpt_r2=nothing much/same/up, dev_r1=nothing much/same/same
- T6 chatted with|people mean well|core: opusnormal_r1=good sign/same/up, opusnormal_r2=nothing much/same/up, opusblind_r1=nothing much/same/same, opusblind_r2=nothing much/same/same, gemini_r1=nothing much/same/same, gemini_r2=nothing much/same/same, chatgpt_r1=nothing much/same/same, chatgpt_r2=nothing much/same/up, dev_r1=nothing much/same/same
- T6 chatted with|people are against me|faint: opusnormal_r1=nothing much/weaker/same, opusnormal_r2=nothing much/weaker/same, opusblind_r1=nothing much/weaker/same, opusblind_r2=nothing much/weaker/same, gemini_r1=nothing much/weaker/same, gemini_r2=nothing much/weaker/same, chatgpt_r1=nothing much/same/same, chatgpt_r2=nothing much/same/same, dev_r1=nothing much/same/same
- T6 shared food with|people are against me|core: opusnormal_r1=good sign/strained/up, opusnormal_r2=good sign/strained/up, opusblind_r1=good sign/strained/up, opusblind_r2=good sign/strained/up, gemini_r1=nothing much/strained/up, gemini_r2=nothing much/strained/same, chatgpt_r1=good sign/strained/up, chatgpt_r2=good sign/strained/up, dev_r1=nothing much/same/same
- T6 argued with|people mean well|faint: opusnormal_r1=slight/weaker/down, opusnormal_r2=slight/weaker/down, opusblind_r1=slight/weaker/down, opusblind_r2=insult/weaker/down, gemini_r1=insult/weaker/down, gemini_r2=insult/weaker/down, chatgpt_r1=insult/weaker/down, chatgpt_r2=insult/weaker/down, dev_r1=slight/weaker/down
- T6 argued with|people mean well|held: opusnormal_r1=slight/weaker/down, opusnormal_r2=slight/same/down, opusblind_r1=slight/same/down, opusblind_r2=slight/weaker/down, gemini_r1=insult/weaker/down, gemini_r2=insult/weaker/down, chatgpt_r1=insult/weaker/down, chatgpt_r2=insult/weaker/down, dev_r1=slight/weaker/down
- T6 argued with|people mean well|core: opusnormal_r1=slight/same/same, opusnormal_r2=slight/same/same, opusblind_r1=slight/same/same, opusblind_r2=slight/same/down, gemini_r1=slight/strained/down, gemini_r2=insult/strained/down, chatgpt_r1=insult/strained/down, chatgpt_r2=insult/strained/down, dev_r1=slight/same/down
- T6 argued with|people are against me|faint: opusnormal_r1=insult/stronger/down, opusnormal_r2=insult/stronger/down, opusblind_r1=insult/stronger/down, opusblind_r2=insult/stronger/down, gemini_r1=insult/stronger/down, gemini_r2=insult/stronger/down, chatgpt_r1=good sign/stronger/down, chatgpt_r2=insult/stronger/down, dev_r1=slight/stronger/down
- T6 argued with|people are against me|held: opusnormal_r1=insult/stronger/down, opusnormal_r2=insult/stronger/down, opusblind_r1=insult/stronger/down, opusblind_r2=insult/stronger/down, gemini_r1=insult/stronger/down, gemini_r2=insult/stronger/down, chatgpt_r1=good sign/stronger/down, chatgpt_r2=insult/stronger/down, dev_r1=insult/stronger/down
- T6 argued with|people are against me|core: opusnormal_r1=insult/same/down, opusnormal_r2=insult/same/down, opusblind_r1=insult/same/down, opusblind_r2=insult/same/down, gemini_r1=insult/same/down, gemini_r2=insult/same/down, chatgpt_r1=good sign/same/down, chatgpt_r2=insult/same/down, dev_r1=insult/same/down
- T6 interrupted|people mean well|faint: opusnormal_r1=slight/weaker/down, opusnormal_r2=slight/same/down, opusblind_r1=slight/same/down, opusblind_r2=slight/weaker/down, gemini_r1=slight/weaker/down, gemini_r2=nothing much/same/same, chatgpt_r1=slight/weaker/down, chatgpt_r2=slight/weaker/down, dev_r1=nothing much/same/same
- T6 interrupted|people mean well|held: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=nothing much/same/same, opusblind_r2=slight/same/same, gemini_r1=nothing much/same/same, gemini_r2=slight/weaker/down, chatgpt_r1=slight/weaker/down, chatgpt_r2=slight/same/down, dev_r1=nothing much/same/same
- T6 interrupted|people mean well|core: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=nothing much/same/same, opusblind_r2=nothing much/same/same, gemini_r1=nothing much/same/same, gemini_r2=slight/same/down, chatgpt_r1=slight/strained/down, chatgpt_r2=slight/same/down, dev_r1=nothing much/same/same
- T6 interrupted|people are against me|faint: opusnormal_r1=slight/stronger/down, opusnormal_r2=slight/stronger/down, opusblind_r1=slight/stronger/down, opusblind_r2=slight/stronger/down, gemini_r1=slight/stronger/down, gemini_r2=slight/stronger/down, chatgpt_r1=slight/stronger/same, chatgpt_r2=slight/stronger/down, dev_r1=slight/stronger/down
- T6 interrupted|people are against me|held: opusnormal_r1=slight/stronger/down, opusnormal_r2=slight/stronger/down, opusblind_r1=slight/stronger/down, opusblind_r2=slight/stronger/down, gemini_r1=slight/stronger/down, gemini_r2=slight/stronger/down, chatgpt_r1=slight/stronger/same, chatgpt_r2=slight/stronger/down, dev_r1=slight/stronger/down
- T6 interrupted|people are against me|core: opusnormal_r1=insult/same/down, opusnormal_r2=insult/same/down, opusblind_r1=insult/same/down, opusblind_r2=insult/same/down, gemini_r1=insult/same/down, gemini_r2=insult/same/down, chatgpt_r1=slight/same/same, chatgpt_r2=slight/same/down, dev_r1=insult/same/down
- T6 apologised to|people are against me|held: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=good sign/weaker/up, opusblind_r2=good sign/weaker/up, gemini_r1=nothing much/weaker/same, gemini_r2=nothing much/weaker/same, chatgpt_r1=good sign/weaker/up, chatgpt_r2=good sign/weaker/up, dev_r1=nothing much/weaker/same
- T6 apologised to|people are against me|core: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=nothing much/same/same, opusblind_r2=nothing much/same/same, gemini_r1=nothing much/same/same, gemini_r2=nothing much/same/same, chatgpt_r1=good sign/strained/up, chatgpt_r2=good sign/strained/up, dev_r1=nothing much/same/same
- T7 praised|i am respected|held|high: opusnormal_r1=nothing much/same/up, opusnormal_r2=nothing much/same/up, opusblind_r1=nothing much/same/same, opusblind_r2=good sign/stronger/up, gemini_r1=nothing much/same/up, gemini_r2=good sign/stronger/up, chatgpt_r1=good sign/stronger/up, chatgpt_r2=good sign/stronger/up, dev_r1=good sign/stronger/up
- T7 praised|i am respected|core|mid: opusnormal_r1=good sign/same/up, opusnormal_r2=good sign/same/up, opusblind_r1=good sign/same/up, opusblind_r2=good sign/same/up, gemini_r1=nothing much/same/up, gemini_r2=good sign/same/up, chatgpt_r1=good sign/same/up, chatgpt_r2=good sign/same/up, dev_r1=good sign/same/up
- T7 praised|i am respected|core|high: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=nothing much/same/same, opusblind_r2=nothing much/same/up, gemini_r1=nothing much/same/same, gemini_r2=nothing much/same/same, chatgpt_r1=good sign/same/up, chatgpt_r2=good sign/same/up, dev_r1=nothing much/same/same
- T7 praised|i am overlooked|faint|low: opusnormal_r1=good sign/weaker/up, opusnormal_r2=good sign/weaker/up, opusblind_r1=good sign/weaker/up, opusblind_r2=good sign/weaker/up, gemini_r1=good sign/weaker/up, gemini_r2=good sign/weaker/up, chatgpt_r1=nothing much/weaker/up, chatgpt_r2=good sign/weaker/up, dev_r1=good sign/weaker/up
- T7 praised|i am overlooked|faint|mid: opusnormal_r1=good sign/weaker/up, opusnormal_r2=good sign/weaker/up, opusblind_r1=good sign/weaker/up, opusblind_r2=good sign/weaker/up, gemini_r1=good sign/weaker/up, gemini_r2=good sign/weaker/up, chatgpt_r1=slight/weaker/up, chatgpt_r2=good sign/weaker/up, dev_r1=good sign/weaker/up
- T7 praised|i am overlooked|faint|high: opusnormal_r1=good sign/weaker/up, opusnormal_r2=good sign/weaker/up, opusblind_r1=good sign/weaker/up, opusblind_r2=good sign/weaker/up, gemini_r1=good sign/weaker/up, gemini_r2=good sign/weaker/up, chatgpt_r1=slight/weaker/up, chatgpt_r2=good sign/weaker/up, dev_r1=good sign/weaker/up
- T7 praised|i am overlooked|held|low: opusnormal_r1=good sign/weaker/up, opusnormal_r2=good sign/weaker/up, opusblind_r1=good sign/weaker/up, opusblind_r2=good sign/weaker/up, gemini_r1=good sign/weaker/up, gemini_r2=good sign/weaker/up, chatgpt_r1=nothing much/weaker/up, chatgpt_r2=good sign/weaker/up, dev_r1=good sign/weaker/up
- T7 praised|i am overlooked|held|mid: opusnormal_r1=good sign/weaker/up, opusnormal_r2=good sign/weaker/up, opusblind_r1=good sign/weaker/up, opusblind_r2=good sign/weaker/up, gemini_r1=good sign/weaker/up, gemini_r2=good sign/weaker/up, chatgpt_r1=slight/weaker/up, chatgpt_r2=good sign/weaker/up, dev_r1=good sign/weaker/up
- T7 praised|i am overlooked|held|high: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=good sign/weaker/up, opusblind_r2=good sign/weaker/up, gemini_r1=nothing much/weaker/same, gemini_r2=nothing much/weaker/same, chatgpt_r1=slight/weaker/up, chatgpt_r2=good sign/weaker/up, dev_r1=nothing much/same/same
- T7 praised|i am overlooked|core|low: opusnormal_r1=good sign/strained/up, opusnormal_r2=nothing much/same/same, opusblind_r1=nothing much/same/same, opusblind_r2=nothing much/same/same, gemini_r1=good sign/strained/up, gemini_r2=good sign/strained/up, chatgpt_r1=nothing much/strained/up, chatgpt_r2=good sign/strained/up, dev_r1=nothing much/strained/up
- T7 praised|i am overlooked|core|mid: opusnormal_r1=nothing much/same/same, opusnormal_r2=good sign/strained/up, opusblind_r1=good sign/strained/up, opusblind_r2=good sign/strained/up, gemini_r1=nothing much/same/same, gemini_r2=nothing much/strained/same, chatgpt_r1=slight/strained/up, chatgpt_r2=good sign/strained/up, dev_r1=nothing much/same/same
- T7 praised|i am overlooked|core|high: opusnormal_r1=slight/same/down, opusnormal_r2=nothing much/same/same, opusblind_r1=good sign/strained/up, opusblind_r2=good sign/strained/up, gemini_r1=nothing much/same/same, gemini_r2=nothing much/same/same, chatgpt_r1=slight/strained/up, chatgpt_r2=good sign/strained/up, dev_r1=nothing much/same/same
- T7 ignored|i am respected|faint|low: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=nothing much/same/same, opusblind_r2=nothing much/same/same, gemini_r1=nothing much/weaker/same, gemini_r2=nothing much/weaker/same, chatgpt_r1=slight/weaker/down, chatgpt_r2=slight/weaker/down, dev_r1=nothing much/same/same
- T7 ignored|i am respected|faint|mid: opusnormal_r1=slight/weaker/down, opusnormal_r2=slight/weaker/down, opusblind_r1=slight/weaker/down, opusblind_r2=slight/weaker/down, gemini_r1=slight/weaker/down, gemini_r2=slight/weaker/down, chatgpt_r1=slight/weaker/down, chatgpt_r2=slight/weaker/down, dev_r1=nothing much/weaker/same
- T7 ignored|i am respected|faint|high: opusnormal_r1=slight/weaker/down, opusnormal_r2=insult/weaker/down, opusblind_r1=insult/weaker/down, opusblind_r2=slight/weaker/down, gemini_r1=insult/weaker/down, gemini_r2=insult/weaker/down, chatgpt_r1=slight/weaker/down, chatgpt_r2=insult/weaker/down, dev_r1=slight/weaker/down
- T7 ignored|i am respected|held|low: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=nothing much/same/same, opusblind_r2=nothing much/same/same, gemini_r1=nothing much/same/same, gemini_r2=nothing much/same/same, chatgpt_r1=slight/weaker/down, chatgpt_r2=slight/weaker/down, dev_r1=nothing much/same/same
- T7 ignored|i am respected|held|mid: opusnormal_r1=slight/same/down, opusnormal_r2=slight/same/down, opusblind_r1=slight/same/down, opusblind_r2=nothing much/same/same, gemini_r1=slight/weaker/down, gemini_r2=slight/weaker/down, chatgpt_r1=slight/weaker/down, chatgpt_r2=slight/weaker/down, dev_r1=nothing much/same/same
- T7 ignored|i am respected|held|high: opusnormal_r1=insult/weaker/down, opusnormal_r2=insult/same/down, opusblind_r1=insult/weaker/down, opusblind_r2=slight/same/down, gemini_r1=insult/weaker/down, gemini_r2=insult/weaker/down, chatgpt_r1=slight/weaker/down, chatgpt_r2=insult/weaker/down, dev_r1=slight/weaker/down
- T7 ignored|i am respected|core|low: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=nothing much/same/same, opusblind_r2=nothing much/same/same, gemini_r1=nothing much/same/same, gemini_r2=nothing much/same/same, chatgpt_r1=slight/strained/down, chatgpt_r2=slight/strained/down, dev_r1=nothing much/same/same
- T7 ignored|i am respected|core|mid: opusnormal_r1=slight/same/down, opusnormal_r2=slight/same/down, opusblind_r1=slight/same/down, opusblind_r2=nothing much/same/same, gemini_r1=slight/same/down, gemini_r2=slight/same/down, chatgpt_r1=slight/strained/down, chatgpt_r2=slight/strained/down, dev_r1=nothing much/same/same
- T7 ignored|i am respected|core|high: opusnormal_r1=insult/strained/down, opusnormal_r2=insult/same/down, opusblind_r1=insult/strained/down, opusblind_r2=insult/same/down, gemini_r1=insult/strained/down, gemini_r2=insult/strained/down, chatgpt_r1=slight/strained/down, chatgpt_r2=insult/strained/down, dev_r1=slight/same/down
- T7 ignored|i am overlooked|faint|low: opusnormal_r1=nothing much/stronger/same, opusnormal_r2=nothing much/same/same, opusblind_r1=slight/stronger/same, opusblind_r2=slight/stronger/same, gemini_r1=nothing much/stronger/same, gemini_r2=nothing much/stronger/same, chatgpt_r1=nothing much/stronger/same, chatgpt_r2=nothing much/same/same, dev_r1=nothing much/stronger/same
- T7 ignored|i am overlooked|faint|mid: opusnormal_r1=slight/stronger/down, opusnormal_r2=slight/stronger/down, opusblind_r1=slight/stronger/down, opusblind_r2=slight/stronger/down, gemini_r1=slight/stronger/down, gemini_r2=slight/stronger/down, chatgpt_r1=insult/stronger/same, chatgpt_r2=nothing much/same/same, dev_r1=slight/stronger/down
- T7 ignored|i am overlooked|faint|high: opusnormal_r1=slight/stronger/down, opusnormal_r2=slight/stronger/down, opusblind_r1=insult/stronger/down, opusblind_r2=insult/stronger/down, gemini_r1=insult/stronger/down, gemini_r2=insult/stronger/down, chatgpt_r1=insult/stronger/down, chatgpt_r2=slight/same/down, dev_r1=slight/stronger/down
- T7 ignored|i am overlooked|held|low: opusnormal_r1=slight/stronger/same, opusnormal_r2=slight/stronger/same, opusblind_r1=slight/stronger/same, opusblind_r2=slight/stronger/same, gemini_r1=slight/stronger/down, gemini_r2=slight/stronger/down, chatgpt_r1=nothing much/stronger/same, chatgpt_r2=nothing much/same/same, dev_r1=nothing much/stronger/same
- T7 ignored|i am overlooked|held|mid: opusnormal_r1=slight/stronger/down, opusnormal_r2=slight/stronger/down, opusblind_r1=slight/stronger/down, opusblind_r2=slight/stronger/down, gemini_r1=slight/stronger/down, gemini_r2=slight/stronger/down, chatgpt_r1=insult/stronger/same, chatgpt_r2=nothing much/same/same, dev_r1=slight/stronger/down
- T7 ignored|i am overlooked|held|high: opusnormal_r1=insult/stronger/down, opusnormal_r2=insult/stronger/down, opusblind_r1=insult/stronger/down, opusblind_r2=insult/stronger/down, gemini_r1=insult/stronger/down, gemini_r2=insult/stronger/down, chatgpt_r1=insult/stronger/down, chatgpt_r2=slight/same/down, dev_r1=insult/stronger/down
- T7 ignored|i am overlooked|core|low: opusnormal_r1=nothing much/same/same, opusnormal_r2=nothing much/same/same, opusblind_r1=slight/same/same, opusblind_r2=slight/same/same, gemini_r1=slight/same/down, gemini_r2=slight/same/down, chatgpt_r1=nothing much/same/same, chatgpt_r2=nothing much/same/same, dev_r1=slight/same/down
- T7 ignored|i am overlooked|core|mid: opusnormal_r1=slight/same/down, opusnormal_r2=slight/same/down, opusblind_r1=slight/same/down, opusblind_r2=slight/same/down, gemini_r1=insult/same/down, gemini_r2=insult/same/down, chatgpt_r1=insult/same/same, chatgpt_r2=nothing much/same/same, dev_r1=slight/same/down
- T7 ignored|i am overlooked|core|high: opusnormal_r1=insult/same/down, opusnormal_r2=insult/same/down, opusblind_r1=insult/same/down, opusblind_r2=insult/same/down, gemini_r1=insult/same/down, gemini_r2=insult/same/down, chatgpt_r1=insult/same/down, chatgpt_r2=slight/same/down, dev_r1=insult/same/down
- T7 credit taken|i am respected|faint|low: opusnormal_r1=slight/weaker/down, opusnormal_r2=slight/weaker/down, opusblind_r1=slight/weaker/down, opusblind_r2=slight/weaker/down, gemini_r1=slight/weaker/down, gemini_r2=slight/weaker/down, chatgpt_r1=insult/weaker/down, chatgpt_r2=insult/weaker/down, dev_r1=slight/weaker/down
- T7 credit taken|i am respected|faint|mid: opusnormal_r1=insult/weaker/down, opusnormal_r2=insult/weaker/down, opusblind_r1=insult/weaker/down, opusblind_r2=insult/weaker/down, gemini_r1=insult/weaker/down, gemini_r2=insult/weaker/down, chatgpt_r1=insult/weaker/down, chatgpt_r2=insult/weaker/down, dev_r1=slight/weaker/down
- T7 credit taken|i am respected|held|low: opusnormal_r1=slight/same/down, opusnormal_r2=slight/same/down, opusblind_r1=slight/same/down, opusblind_r2=slight/same/down, gemini_r1=slight/weaker/down, gemini_r2=slight/weaker/down, chatgpt_r1=insult/weaker/down, chatgpt_r2=insult/weaker/down, dev_r1=slight/same/down
- T7 credit taken|i am respected|held|mid: opusnormal_r1=insult/weaker/down, opusnormal_r2=insult/weaker/down, opusblind_r1=insult/weaker/down, opusblind_r2=insult/same/down, gemini_r1=insult/weaker/down, gemini_r2=insult/weaker/down, chatgpt_r1=insult/weaker/down, chatgpt_r2=insult/weaker/down, dev_r1=slight/weaker/down
- T7 credit taken|i am respected|held|high: opusnormal_r1=insult/weaker/down, opusnormal_r2=insult/same/down, opusblind_r1=insult/weaker/down, opusblind_r2=insult/same/down, gemini_r1=insult/weaker/down, gemini_r2=insult/weaker/down, chatgpt_r1=insult/weaker/down, chatgpt_r2=insult/weaker/down, dev_r1=insult/weaker/down
- T7 credit taken|i am respected|core|low: opusnormal_r1=slight/same/down, opusnormal_r2=slight/same/down, opusblind_r1=slight/same/down, opusblind_r2=slight/same/down, gemini_r1=slight/same/down, gemini_r2=slight/same/down, chatgpt_r1=insult/strained/down, chatgpt_r2=insult/strained/down, dev_r1=slight/same/down
- T7 credit taken|i am respected|core|mid: opusnormal_r1=insult/strained/down, opusnormal_r2=insult/same/down, opusblind_r1=insult/same/down, opusblind_r2=insult/same/down, gemini_r1=insult/strained/down, gemini_r2=insult/strained/down, chatgpt_r1=insult/strained/down, chatgpt_r2=insult/strained/down, dev_r1=slight/same/down
- T7 credit taken|i am overlooked|faint|low: opusnormal_r1=slight/stronger/down, opusnormal_r2=slight/stronger/down, opusblind_r1=slight/stronger/down, opusblind_r2=slight/stronger/down, gemini_r1=slight/stronger/down, gemini_r2=slight/stronger/down, chatgpt_r1=slight/stronger/down, chatgpt_r2=insult/stronger/down, dev_r1=slight/stronger/down
- T7 credit taken|i am overlooked|held|low: opusnormal_r1=slight/stronger/down, opusnormal_r2=slight/stronger/down, opusblind_r1=slight/stronger/down, opusblind_r2=slight/stronger/down, gemini_r1=slight/stronger/down, gemini_r2=insult/stronger/down, chatgpt_r1=slight/stronger/down, chatgpt_r2=insult/stronger/down, dev_r1=slight/stronger/down
- T7 credit taken|i am overlooked|core|low: opusnormal_r1=slight/same/down, opusnormal_r2=slight/same/down, opusblind_r1=slight/same/down, opusblind_r2=slight/same/down, gemini_r1=insult/same/down, gemini_r2=insult/same/down, chatgpt_r1=slight/same/down, chatgpt_r2=insult/same/down, dev_r1=insult/same/down
- T8 work went well|nothing i do matters|held: opusnormal_r1=good sign/weaker, opusnormal_r2=good sign/weaker, opusblind_r1=good sign/weaker, opusblind_r2=good sign/weaker, gemini_r1=good sign/weaker, gemini_r2=good sign/weaker, chatgpt_r1=good sign/weaker, chatgpt_r2=good sign/weaker, dev_r1=nothing much/weaker
- T8 work went well|nothing i do matters|core: opusnormal_r1=nothing much/same, opusnormal_r2=nothing much/same, opusblind_r1=nothing much/same, opusblind_r2=nothing much/same, gemini_r1=nothing much/strained, gemini_r2=nothing much/strained, chatgpt_r1=good sign/strained, chatgpt_r2=good sign/strained, dev_r1=nothing much/same
- T8 work went badly|hard work pays off|faint: opusnormal_r1=slight/weaker, opusnormal_r2=slight/weaker, opusblind_r1=slight/weaker, opusblind_r2=slight/weaker, gemini_r1=slight/weaker, gemini_r2=slight/weaker, chatgpt_r1=insult/weaker, chatgpt_r2=slight/weaker, dev_r1=slight/weaker
- T8 work went badly|hard work pays off|held: opusnormal_r1=slight/same, opusnormal_r2=nothing much/same, opusblind_r1=slight/same, opusblind_r2=slight/same, gemini_r1=slight/weaker, gemini_r2=slight/weaker, chatgpt_r1=insult/weaker, chatgpt_r2=slight/weaker, dev_r1=nothing much/same
- T8 work went badly|hard work pays off|core: opusnormal_r1=slight/same, opusnormal_r2=nothing much/same, opusblind_r1=slight/same, opusblind_r2=slight/same, gemini_r1=nothing much/strained, gemini_r2=slight/strained, chatgpt_r1=insult/strained, chatgpt_r2=slight/strained, dev_r1=nothing much/same
- T8 work went badly|nothing i do matters|faint: opusnormal_r1=slight/stronger, opusnormal_r2=slight/stronger, opusblind_r1=slight/stronger, opusblind_r2=slight/stronger, gemini_r1=slight/stronger, gemini_r2=slight/stronger, chatgpt_r1=insult/stronger, chatgpt_r2=good sign/stronger, dev_r1=slight/stronger
- T8 work went badly|nothing i do matters|held: opusnormal_r1=nothing much/stronger, opusnormal_r2=slight/stronger, opusblind_r1=slight/stronger, opusblind_r2=slight/stronger, gemini_r1=slight/stronger, gemini_r2=slight/stronger, chatgpt_r1=insult/stronger, chatgpt_r2=good sign/stronger, dev_r1=slight/stronger
- T8 work went badly|nothing i do matters|core: opusnormal_r1=nothing much/same, opusnormal_r2=slight/same, opusblind_r1=nothing much/same, opusblind_r2=nothing much/same, gemini_r1=slight/same, gemini_r2=nothing much/same, chatgpt_r1=insult/same, chatgpt_r2=good sign/same, dev_r1=nothing much/same
- T9 calm|slight: opusnormal_r1=calm, opusnormal_r2=calm, opusblind_r1=calm, opusblind_r2=low, gemini_r1=low, gemini_r2=low, chatgpt_r1=low, chatgpt_r2=low, dev_r1=calm
- T10 low|slight|none: opusnormal_r1=cool off, opusnormal_r2=cool off, opusblind_r1=hold grudge, opusblind_r2=hold grudge, gemini_r1=hold grudge, gemini_r2=hold grudge, chatgpt_r1=cool off, chatgpt_r2=cool off, dev_r1=hold grudge
- T10 low|slight|received: opusnormal_r1=cool off, opusnormal_r2=let it go, opusblind_r1=let it go, opusblind_r2=cool off, gemini_r1=cool off, gemini_r2=cool off, chatgpt_r1=cool off, chatgpt_r2=let it go, dev_r1=cool off
- T10 low|insult|received: opusnormal_r1=cool off, opusnormal_r2=cool off, opusblind_r1=cool off, opusblind_r2=cool off, gemini_r1=hold grudge, gemini_r2=hold grudge, chatgpt_r1=cool off, chatgpt_r2=hold grudge, dev_r1=hold grudge
- T10 mid|slight|none: opusnormal_r1=cool off, opusnormal_r2=cool off, opusblind_r1=cool off, opusblind_r2=cool off, gemini_r1=cool off, gemini_r2=cool off, chatgpt_r1=let it go, chatgpt_r2=cool off, dev_r1=cool off
- T10 high|insult|none: opusnormal_r1=cool off, opusnormal_r2=cool off, opusblind_r1=cool off, opusblind_r2=cool off, gemini_r1=cool off, gemini_r2=cool off, chatgpt_r1=hold grudge, chatgpt_r2=cool off, dev_r1=cool off
- T12 people mean well|held: opusnormal_r1=+1/0/0/0, opusnormal_r2=+1/0/0/0, opusblind_r1=+1/0/0/0, opusblind_r2=+1/0/0/0, gemini_r1=+1/+1/0/0, gemini_r2=+1/+1/0/0, chatgpt_r1=+1/+1/0/0, chatgpt_r2=+1/+1/0/0, dev_r1=+1/0/0/0
- T12 people are against me|faint: opusnormal_r1=0/-1/0/0, opusnormal_r2=0/0/0/0, opusblind_r1=0/-1/0/0, opusblind_r2=0/0/0/0, gemini_r1=0/-1/0/0, gemini_r2=0/-1/0/0, chatgpt_r1=0/0/0/0, chatgpt_r2=0/-1/0/0, dev_r1=0/0/0/0
- T12 people are against me|held: opusnormal_r1=-1/-1/0/0, opusnormal_r2=-1/-1/0/0, opusblind_r1=-1/-1/0/0, opusblind_r2=-1/-1/0/0, gemini_r1=-1/-1/0/0, gemini_r2=-1/-1/0/0, chatgpt_r1=-1/-1/0/+1, chatgpt_r2=-1/-1/0/+1, dev_r1=-1/-1/0/0
- T12 people are against me|core: opusnormal_r1=-1/-1/0/+1, opusnormal_r2=-1/-1/0/+1, opusblind_r1=-1/-1/0/+1, opusblind_r2=-1/-1/0/+1, gemini_r1=-1/-1/-1/+1, gemini_r2=-1/-1/-1/0, chatgpt_r1=-1/-1/0/+1, chatgpt_r2=-1/-1/0/+1, dev_r1=-1/-1/0/0
- T12 i am respected|faint: opusnormal_r1=0/0/0/0, opusnormal_r2=0/0/0/0, opusblind_r1=0/0/0/+1, opusblind_r2=0/0/0/0, gemini_r1=0/0/0/0, gemini_r2=0/0/0/0, chatgpt_r1=0/0/0/0, chatgpt_r2=0/0/0/0, dev_r1=0/0/0/0
- T12 i am respected|held: opusnormal_r1=0/+1/0/+1, opusnormal_r2=0/+1/0/+1, opusblind_r1=0/+1/0/+1, opusblind_r2=0/+1/0/+1, gemini_r1=0/+1/0/+1, gemini_r2=0/+1/0/+1, chatgpt_r1=0/+1/0/+1, chatgpt_r2=0/+1/0/+1, dev_r1=0/0/0/0
- T12 i am respected|core: opusnormal_r1=0/+1/0/+1, opusnormal_r2=0/+1/0/+1, opusblind_r1=0/+1/0/+1, opusblind_r2=0/+1/0/+1, gemini_r1=+1/+1/0/+1, gemini_r2=+1/+1/0/+1, chatgpt_r1=0/+1/0/+1, chatgpt_r2=0/+1/0/+1, dev_r1=0/+1/0/+1
- T12 i am overlooked|faint: opusnormal_r1=0/0/0/0, opusnormal_r2=0/0/0/0, opusblind_r1=0/-1/0/0, opusblind_r2=0/0/0/0, gemini_r1=0/0/0/0, gemini_r2=0/0/0/0, chatgpt_r1=0/0/0/0, chatgpt_r2=0/0/0/0, dev_r1=0/0/0/0
- T12 i am overlooked|held: opusnormal_r1=0/-1/0/-1, opusnormal_r2=0/-1/0/-1, opusblind_r1=0/-1/0/-1, opusblind_r2=0/-1/0/0, gemini_r1=0/-1/0/-1, gemini_r2=0/-1/0/-1, chatgpt_r1=-1/-1/0/-1, chatgpt_r2=-1/-1/0/-1, dev_r1=0/-1/0/0
- T12 i am overlooked|core: opusnormal_r1=-1/-1/0/-1, opusnormal_r2=-1/-1/0/-1, opusblind_r1=-1/-1/0/-1, opusblind_r2=-1/-1/0/-1, gemini_r1=-1/-1/-1/-1, gemini_r2=-1/-1/-1/-1, chatgpt_r1=-1/-1/0/-1, chatgpt_r2=-1/-1/0/-1, dev_r1=-1/-1/0/0
- T12 hard work pays off|faint: opusnormal_r1=0/0/0/0, opusnormal_r2=0/0/0/0, opusblind_r1=0/0/+1/0, opusblind_r2=0/0/0/0, gemini_r1=0/0/+1/0, gemini_r2=0/0/+1/0, chatgpt_r1=0/0/0/0, chatgpt_r2=0/0/+1/0, dev_r1=0/0/0/0
- T12 hard work pays off|core: opusnormal_r1=0/0/+1/+1, opusnormal_r2=0/0/+1/+1, opusblind_r1=0/0/+1/+1, opusblind_r2=0/0/+1/+1, gemini_r1=0/0/+1/+1, gemini_r2=0/0/+1/+1, chatgpt_r1=0/0/+1/0, chatgpt_r2=0/0/+1/0, dev_r1=0/0/+1/0
- T12 nothing i do matters|faint: opusnormal_r1=0/0/0/0, opusnormal_r2=0/0/0/0, opusblind_r1=0/0/-1/0, opusblind_r2=0/0/0/0, gemini_r1=0/0/-1/0, gemini_r2=0/0/-1/0, chatgpt_r1=0/0/0/0, chatgpt_r2=0/0/-1/0, dev_r1=0/0/0/0
- T12 nothing i do matters|held: opusnormal_r1=0/0/-1/0, opusnormal_r2=0/0/-1/0, opusblind_r1=0/-1/-1/0, opusblind_r2=0/0/-1/0, gemini_r1=0/-1/-1/0, gemini_r2=0/-1/-1/0, chatgpt_r1=-1/-1/-1/-1, chatgpt_r2=0/-1/-1/-1, dev_r1=0/0/-1/0
- T12 nothing i do matters|core: opusnormal_r1=0/-1/-1/0, opusnormal_r2=0/-1/-1/-1, opusblind_r1=-1/-1/-1/-1, opusblind_r2=0/-1/-1/-1, gemini_r1=-1/-1/-1/-1, gemini_r2=-1/-1/-1/-1, chatgpt_r1=-1/-1/-1/-1, chatgpt_r2=0/-1/-1/-1, dev_r1=0/-1/-1/0

</details>
