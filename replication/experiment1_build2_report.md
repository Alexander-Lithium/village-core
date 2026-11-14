# Replication report: Village Core v1.0, build 2

**Date:** 2026-11-13
**Build 1 (reference):** Claude Opus 5.5, built and run inside the project working session, which also wrote the spec.
**Build 2 (independent):** Claude Opus 5.5 (medium), fresh **incognito** chat. Input: `village-core-v1-build-prompt.md` (spec Part A, v1.0), pasted unchanged with no other context. The builder could not execute code, so it returned source files only. The operator copied them verbatim into a separate folder and ran them unmodified with Node 22. Raw reply: `build2_opus55_incognito/raw_reply.txt`.

## Results (build 2's code unmodified)

| Check | Result |
| --- | --- |
| Build 2's own acceptance tests | 12/12 pass (its 11 specified tests plus an added SHA-256 known-vector test) |
| Cast file (castSeed 1, n 20) | Byte-identical. Hash `89d3b47e…da885b` |
| 12 rule tables | All byte-identical |
| Golden: runSeed 1, n 20, days 30 | State `f64386a9…a76d75` and log `7b862fb6…18d48d9`: **both match** |
| Golden: runSeed 1, n 5, days 3 | State `7ae5d3c7…2b06fa1c` and log `40733d27…7bc96b204`: **both match** |
| runSeed 7, n 20, days 60 | State and log match |
| runSeed 3, loop off | State and log match |
| runSeed 3, traits off | State and log match |
| runSeed 5, shuffled tables | State and log match |
| runSeed 5, random tables | State and log match |
| runSeed 2, n 100 (5 hamlets), days 10 | State and log match |
| runSeed 1, n 10,000, days 1 | **Differed** (see below) |

The state hash covers every villager's full final state: body, mood, room, beliefs, effective traits, evidence buffers and every relationship. The log hash covers every table lookup in order: 63,000+ lookups in the 30-day, 20-villager run. Matching on both means the two builds made the same decisions in the same order.

## The one divergence and its fix
At n = 10,000 the spec (v1.0) gave villager ids as "`n0001`, `n0002`, …" without saying what villager 10,000 is called or whether "id order" means string or numeric order.
- Build 1 kept 4-digit padding (`n10000`) but sorted relationships by **string** order, which puts `n10000` before `n9981`.
- Build 2 padded every id to 5 digits when n = 10,000 (`n00001` …). It flagged this as builder decision 2.

**Spec v1.0.1 (A4):** ids are padded to 4 digits (`n10000` for villager 10,000), and id order always means numeric order. Build 1 was corrected to sort numerically. Build 2 with only its id padding set to 4 digits (plus its string-order cast check disabled, which the clarified spec makes invalid) then gives the identical 10,000-villager state hash (`f157b7d8…b0a671`). Runs with fewer than 10,000 villagers are unaffected, and all golden hashes are unchanged.

## Interpretation
A single written specification (about 4,300 words) was enough for an independent model session, with no access to the reference code, to produce an engine whose behaviour is bit-for-bit identical to the reference across every tested configuration under 10,000 villagers. The one ambiguity found was located by the hash mismatch, explained by the builder's own notes, and fixed in one sentence of the spec.

**Limitations:** one independent build, from the same model family as the reference builder. Build 2 was written without executing code, so this also shows the spec is precise enough to implement without trial and error. A build from a different model family (e.g. Gemini or ChatGPT) would strengthen the claim.
