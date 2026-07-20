# Scoring

## Traits

Traits use stable identifiers shared by choice effects and character profiles. The initial trait vocabulary is neutral placeholder configuration, not final event language. Adding or renaming a trait should require data and test updates, not question-specific component logic.

## Model

Each choice declares its scoring effects against stable trait identifiers. Scoring functions add the effects from the selected answers to produce trait totals, then compare those totals with the configured traits for each character result. Questions and characters contain configuration only; calculation behavior remains in pure functions.

The scoring API does not read UI state, mutate inputs, use random values, or depend on time. The same selected answers and configuration therefore always produce the same totals and result.

## Matching

Character matching is driven by each character's configured primary and secondary traits:

```text
match score = (primary trait total × 2) + secondary trait total
```

The weights belong to scoring configuration so they can be reviewed and changed without changing React components.

Incomplete or unknown selections do not create implicit points. Session rules prevent normal completion until all eight questions have valid answers.

## Tie-breaking

Characters have an explicit `characterTieBreakOrder` configuration. When multiple characters receive the same match score, the character that appears earliest in that priority list wins. This order is passed deliberately to the calculation and is covered by tests; matching never relies on object key order, incidental iteration order, randomness, or current UI state.

Any future scoring adjustment or scoring bug fix must update this document when the rule changes and include a regression test.
