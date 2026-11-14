# Part 2 of 3

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
