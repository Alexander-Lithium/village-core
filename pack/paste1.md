# Part 1 of 3

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
