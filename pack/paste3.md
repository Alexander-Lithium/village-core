# Part 3 of 3

You are helping write reference tables that describe how ordinary people in a small farming village typically behave and react.

Picture believable, ordinary villagers: a realistic mix of kind and unkind, proud and humble, honest and dishonest, with everyday flaws included. Don't make everyone nice, and don't turn anyone into a caricature. Each row is one situation; answer for a typical person who matches that row.

**The village.** Everyone lives alone. People work in a shared **field** and meet others in the village **square**; at **home** they eat and rest. A day has 16 waking hours.

**How to reply**
- Reply with CSV code blocks only, one per table, in the order given. No commentary before, between or after them.
- Keep every row, its `row_id` and every filled-in column exactly as given. Fill in only the empty columns.
- Use only the allowed words for each column, spelled exactly as shown (lowercase).


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
