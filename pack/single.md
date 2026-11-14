You are helping write reference tables that describe how ordinary people in a small farming village typically behave and react.

Picture believable, ordinary villagers: a realistic mix of kind and unkind, proud and humble, honest and dishonest, with everyday flaws included. Don't make everyone nice, and don't turn anyone into a caricature. Each row is one situation; answer for a typical person who matches that row.

**The village.** Everyone lives alone. People work in a shared **field** and meet others in the village **square**; at **home** they eat and rest. A day has 16 waking hours.

**How to reply**
- Start your reply with one plain line, before the code block: `model: <your model name and version, as far as you know it>`.
- Then reply with **one single CSV code block** containing all ten tables below, in the order given. Keep each table's header line directly above its rows.
- Keep every row, its `row_id` and every filled-in column exactly as given. Fill in only the empty columns.
- Use only the allowed words for each column, spelled exactly as shown (lowercase).
- No other commentary before or after the code block.
- If your reply is cut off, continue in your next message from the next unfinished row, inside a new CSV code block.

**Personal traits** (each is `low`, `mid` or `high`)
- **warmth:** kindness and goodwill toward others.
- **sociability:** how much they enjoy company.
- **diligence:** how hard and steadily they work.
- **honesty:** how truthful and fair they are.
- **pride:** sense of their own importance and status.

**Beliefs and how strongly they're held** (`tier`)
- `faint`: a passing thought they're not sure of.
- `held`: a settled view.
- `core`: part of who they are.

**What to fill in**
- **meaning:** how they take it: `good sign`, `nothing much`, `slight` (a minor offence), `insult` (a real offence).
- **pressure:** what this experience does to the belief shown in the row. For `faint` or `held` beliefs use `stronger` (it confirms the belief, so they hold it more firmly), `same` (no effect), or `weaker` (it makes them doubt it). For `core` beliefs use only `same` or `strained` (it shakes a deeply held belief); a core belief can't get stronger.

## Table: action
Where does a villager choose to spend the next hour?
- **need:** `none` (feeling fine), `eat` (getting hungry), `rest` (getting tired).
- **diligence**, **sociability:** see traits.
- **first:** where they most likely go: `home` (eat or rest), `field` (work), `square` (socialise).
- **second:** where they'd go instead about one time in four. It may be the same as first.

```csv
row_id,need,diligence,sociability,first,second
T2-01,none,low,low,,
T2-02,none,low,mid,,
T2-03,none,low,high,,
T2-04,none,mid,low,,
T2-05,none,mid,mid,,
T2-06,none,mid,high,,
T2-07,none,high,low,,
T2-08,none,high,mid,,
T2-09,none,high,high,,
T2-10,eat,low,low,,
T2-11,eat,low,mid,,
T2-12,eat,low,high,,
T2-13,eat,mid,low,,
T2-14,eat,mid,mid,,
T2-15,eat,mid,high,,
T2-16,eat,high,low,,
T2-17,eat,high,mid,,
T2-18,eat,high,high,,
T2-19,rest,low,low,,
T2-20,rest,low,mid,,
T2-21,rest,low,high,,
T2-22,rest,mid,low,,
T2-23,rest,mid,mid,,
T2-24,rest,mid,high,,
T2-25,rest,high,low,,
T2-26,rest,high,mid,,
T2-27,rest,high,high,,
```

## Table: stance
A villager meets another villager. How do they feel toward that person right now?
- **warmth:** their general kindness (see traits).
- **liking:** how they feel about this particular person: `dislike`, `neutral`, `like`, `close`.
- **mood:** their mood right now: `low`, `calm`, `good`.
- **stance:** `friendly`, `neutral`, `cold`, `hostile`.

```csv
row_id,warmth,liking,mood,stance
T3-01,low,dislike,low,
T3-02,low,dislike,calm,
T3-03,low,dislike,good,
T3-04,low,neutral,low,
T3-05,low,neutral,calm,
T3-06,low,neutral,good,
T3-07,low,like,low,
T3-08,low,like,calm,
T3-09,low,like,good,
T3-10,low,close,low,
T3-11,low,close,calm,
T3-12,low,close,good,
T3-13,mid,dislike,low,
T3-14,mid,dislike,calm,
T3-15,mid,dislike,good,
T3-16,mid,neutral,low,
T3-17,mid,neutral,calm,
T3-18,mid,neutral,good,
T3-19,mid,like,low,
T3-20,mid,like,calm,
T3-21,mid,like,good,
T3-22,mid,close,low,
T3-23,mid,close,calm,
T3-24,mid,close,good,
T3-25,high,dislike,low,
T3-26,high,dislike,calm,
T3-27,high,dislike,good,
T3-28,high,neutral,low,
T3-29,high,neutral,calm,
T3-30,high,neutral,good,
T3-31,high,like,low,
T3-32,high,like,calm,
T3-33,high,like,good,
T3-34,high,close,low,
T3-35,high,close,calm,
T3-36,high,close,good,
```

## Table: act
A villager meets someone. Given how they feel toward that person (stance), where they are, and their honesty, what do they do?
- **stance:** `friendly`, `neutral`, `cold`, `hostile`.
- **room:** `field` (at work) or `square` (in the village square).
- **honesty:** see traits.
- Allowed acts in the **field:** `help` (help with their work), `chat`, `take credit` (take credit for the other's work), `argue`.
- Allowed acts in the **square:** `chat`, `praise`, `share food`, `interrupt`, `ignore`, `argue`.
- **first:** what they most likely do. **second:** what they'd do instead about one time in four (may be the same as first). Use only acts allowed in that room.

```csv
row_id,stance,room,honesty,first,second
T4-01,friendly,field,low,,
T4-02,friendly,field,mid,,
T4-03,friendly,field,high,,
T4-04,friendly,square,low,,
T4-05,friendly,square,mid,,
T4-06,friendly,square,high,,
T4-07,neutral,field,low,,
T4-08,neutral,field,mid,,
T4-09,neutral,field,high,,
T4-10,neutral,square,low,,
T4-11,neutral,square,mid,,
T4-12,neutral,square,high,,
T4-13,cold,field,low,,
T4-14,cold,field,mid,,
T4-15,cold,field,high,,
T4-16,cold,square,low,,
T4-17,cold,square,mid,,
T4-18,cold,square,high,,
T4-19,hostile,field,low,,
T4-20,hostile,field,mid,,
T4-21,hostile,field,high,,
T4-22,hostile,square,low,,
T4-23,hostile,square,mid,,
T4-24,hostile,square,high,,
```

## Table: apology
Earlier, a villager was unkind to someone (argued with them, interrupted them, ignored them, or took credit for their work). Now they meet that person again. Do they apologise?
- **honesty**, **pride:** see traits.
- **decision:** `apologise` or `don't`.

```csv
row_id,honesty,pride,decision
T5-01,low,low,
T5-02,low,mid,
T5-03,low,high,
T5-04,mid,low,
T5-05,mid,mid,
T5-06,mid,high,
T5-07,high,low,
T5-08,high,mid,
T5-09,high,high,
```

## Table: reaction (trust)
Something just happened to a villager involving another person. The villager holds the belief shown, at the strength shown. How do they take it?
- `helped`: someone helped them with their work.
- `chatted with`: someone made small talk with them.
- `shared food with`: someone shared food with them.
- `argued with`: someone argued with them.
- `interrupted`: someone interrupted them.
- `apologised to`: someone apologised to them for an earlier unkindness.
- **belief:** `people mean well` or `people are against me`.
- **liking_change:** how they now feel toward the person involved: `up`, `same`, `down`.

```csv
row_id,event,belief,tier,meaning,pressure,liking_change
T6-01,helped,people mean well,faint,,,
T6-02,helped,people mean well,held,,,
T6-03,helped,people mean well,core,,,
T6-04,helped,people are against me,faint,,,
T6-05,helped,people are against me,held,,,
T6-06,helped,people are against me,core,,,
T6-07,chatted with,people mean well,faint,,,
T6-08,chatted with,people mean well,held,,,
T6-09,chatted with,people mean well,core,,,
T6-10,chatted with,people are against me,faint,,,
T6-11,chatted with,people are against me,held,,,
T6-12,chatted with,people are against me,core,,,
T6-13,shared food with,people mean well,faint,,,
T6-14,shared food with,people mean well,held,,,
T6-15,shared food with,people mean well,core,,,
T6-16,shared food with,people are against me,faint,,,
T6-17,shared food with,people are against me,held,,,
T6-18,shared food with,people are against me,core,,,
T6-19,argued with,people mean well,faint,,,
T6-20,argued with,people mean well,held,,,
T6-21,argued with,people mean well,core,,,
T6-22,argued with,people are against me,faint,,,
T6-23,argued with,people are against me,held,,,
T6-24,argued with,people are against me,core,,,
T6-25,interrupted,people mean well,faint,,,
T6-26,interrupted,people mean well,held,,,
T6-27,interrupted,people mean well,core,,,
T6-28,interrupted,people are against me,faint,,,
T6-29,interrupted,people are against me,held,,,
T6-30,interrupted,people are against me,core,,,
T6-31,apologised to,people mean well,faint,,,
T6-32,apologised to,people mean well,held,,,
T6-33,apologised to,people mean well,core,,,
T6-34,apologised to,people are against me,faint,,,
T6-35,apologised to,people are against me,held,,,
T6-36,apologised to,people are against me,core,,,
```

## Table: reaction (status)
Something just happened to a villager involving another person. The villager holds the belief shown, at the strength shown, and has the pride shown. How do they take it?
- `praised`: someone praised them.
- `ignored`: someone ignored them.
- `credit taken`: someone took credit for their work.
- **belief:** `i am respected` or `i am overlooked`.
- **pride:** see traits.
- **liking_change:** how they now feel toward the person involved: `up`, `same`, `down`.

```csv
row_id,event,belief,tier,pride,meaning,pressure,liking_change
T7-01,praised,i am respected,faint,low,,,
T7-02,praised,i am respected,faint,mid,,,
T7-03,praised,i am respected,faint,high,,,
T7-04,praised,i am respected,held,low,,,
T7-05,praised,i am respected,held,mid,,,
T7-06,praised,i am respected,held,high,,,
T7-07,praised,i am respected,core,low,,,
T7-08,praised,i am respected,core,mid,,,
T7-09,praised,i am respected,core,high,,,
T7-10,praised,i am overlooked,faint,low,,,
T7-11,praised,i am overlooked,faint,mid,,,
T7-12,praised,i am overlooked,faint,high,,,
T7-13,praised,i am overlooked,held,low,,,
T7-14,praised,i am overlooked,held,mid,,,
T7-15,praised,i am overlooked,held,high,,,
T7-16,praised,i am overlooked,core,low,,,
T7-17,praised,i am overlooked,core,mid,,,
T7-18,praised,i am overlooked,core,high,,,
T7-19,ignored,i am respected,faint,low,,,
T7-20,ignored,i am respected,faint,mid,,,
T7-21,ignored,i am respected,faint,high,,,
T7-22,ignored,i am respected,held,low,,,
T7-23,ignored,i am respected,held,mid,,,
T7-24,ignored,i am respected,held,high,,,
T7-25,ignored,i am respected,core,low,,,
T7-26,ignored,i am respected,core,mid,,,
T7-27,ignored,i am respected,core,high,,,
T7-28,ignored,i am overlooked,faint,low,,,
T7-29,ignored,i am overlooked,faint,mid,,,
T7-30,ignored,i am overlooked,faint,high,,,
T7-31,ignored,i am overlooked,held,low,,,
T7-32,ignored,i am overlooked,held,mid,,,
T7-33,ignored,i am overlooked,held,high,,,
T7-34,ignored,i am overlooked,core,low,,,
T7-35,ignored,i am overlooked,core,mid,,,
T7-36,ignored,i am overlooked,core,high,,,
T7-37,credit taken,i am respected,faint,low,,,
T7-38,credit taken,i am respected,faint,mid,,,
T7-39,credit taken,i am respected,faint,high,,,
T7-40,credit taken,i am respected,held,low,,,
T7-41,credit taken,i am respected,held,mid,,,
T7-42,credit taken,i am respected,held,high,,,
T7-43,credit taken,i am respected,core,low,,,
T7-44,credit taken,i am respected,core,mid,,,
T7-45,credit taken,i am respected,core,high,,,
T7-46,credit taken,i am overlooked,faint,low,,,
T7-47,credit taken,i am overlooked,faint,mid,,,
T7-48,credit taken,i am overlooked,faint,high,,,
T7-49,credit taken,i am overlooked,held,low,,,
T7-50,credit taken,i am overlooked,held,mid,,,
T7-51,credit taken,i am overlooked,held,high,,,
T7-52,credit taken,i am overlooked,core,low,,,
T7-53,credit taken,i am overlooked,core,mid,,,
T7-54,credit taken,i am overlooked,core,high,,,
```

## Table: reaction (work)
At the end of the day, a villager learns how their own work went. They hold the belief shown, at the strength shown. How do they take it?
- `work went well`: their own day of work in the field went well.
- `work went badly`: their own day of work in the field went badly.
- **belief:** `hard work pays off` or `nothing i do matters`.

```csv
row_id,event,belief,tier,meaning,pressure
T8-01,work went well,hard work pays off,faint,,
T8-02,work went well,hard work pays off,held,,
T8-03,work went well,hard work pays off,core,,
T8-04,work went well,nothing i do matters,faint,,
T8-05,work went well,nothing i do matters,held,,
T8-06,work went well,nothing i do matters,core,,
T8-07,work went badly,hard work pays off,faint,,
T8-08,work went badly,hard work pays off,held,,
T8-09,work went badly,hard work pays off,core,,
T8-10,work went badly,nothing i do matters,faint,,
T8-11,work went badly,nothing i do matters,held,,
T8-12,work went badly,nothing i do matters,core,,
```

## Table: mood
A villager is in the mood shown, and something just happened that they took as shown (meaning). What is their mood now?
- **mood:** `low`, `calm`, `good`.
- **meaning:** `good sign`, `nothing much`, `slight`, `insult`.
- **new_mood:** `low`, `calm`, `good`.

```csv
row_id,mood,meaning,new_mood
T9-01,low,good sign,
T9-02,low,nothing much,
T9-03,low,slight,
T9-04,low,insult,
T9-05,calm,good sign,
T9-06,calm,nothing much,
T9-07,calm,slight,
T9-08,calm,insult,
T9-09,good,good sign,
T9-10,good,nothing much,
T9-11,good,slight,
T9-12,good,insult,
```

## Table: grudge
Someone upset a villager. How do they respond toward that person?
- **warmth:** the upset villager's general kindness.
- **offence:** `slight` (minor) or `insult` (serious).
- **apology:** `none` (no apology yet) or `received` (the person has just apologised).
- **response:** `let it go` (no hard feelings), `cool off` (a bit distant for the rest of the day), `hold grudge` (stay distant until they apologise), `pay back` (be hostile the next time they meet).

```csv
row_id,warmth,offence,apology,response
T10-01,low,slight,none,
T10-02,low,slight,received,
T10-03,low,insult,none,
T10-04,low,insult,received,
T10-05,mid,slight,none,
T10-06,mid,slight,received,
T10-07,mid,insult,none,
T10-08,mid,insult,received,
T10-09,high,slight,none,
T10-10,high,slight,received,
T10-11,high,insult,none,
T10-12,high,insult,received,
```

## Table: belief and behaviour
A villager holds the belief shown, at the strength shown. Compared with their natural temperament, how does this belief shift their everyday behaviour?
- For each of **warmth**, **sociability**, **diligence**, **pride**: `-1` (less), `0` (no change), `+1` (more).
- Beliefs: `people mean well`, `people are against me`, `i am respected`, `i am overlooked`, `hard work pays off`, `nothing i do matters`.

```csv
row_id,belief,tier,warmth,sociability,diligence,pride
T12-01,people mean well,faint,,,,
T12-02,people mean well,held,,,,
T12-03,people mean well,core,,,,
T12-04,people are against me,faint,,,,
T12-05,people are against me,held,,,,
T12-06,people are against me,core,,,,
T12-07,i am respected,faint,,,,
T12-08,i am respected,held,,,,
T12-09,i am respected,core,,,,
T12-10,i am overlooked,faint,,,,
T12-11,i am overlooked,held,,,,
T12-12,i am overlooked,core,,,,
T12-13,hard work pays off,faint,,,,
T12-14,hard work pays off,held,,,,
T12-15,hard work pays off,core,,,,
T12-16,nothing i do matters,faint,,,,
T12-17,nothing i do matters,held,,,,
T12-18,nothing i do matters,core,,,,
```
