# Quiz Scoring Specification

## Purpose

This document defines how answers in the peer mentor personality quiz are converted into gamer-class results.

The quiz is intended for a game-themed peer mentor / teaching assistant training event.

Participants complete ten "Day in the Life of a Peer Mentor" questions. Each answer contributes hidden weighted points directly to one or more gamer classes.

The resulting gamer class is determined from those accumulated class scores.

This is an entertainment and event-engagement system. It is not intended to represent a scientifically validated personality assessment.

---

# Gamer Classes

The quiz currently contains seven possible results.

| Internal ID | Display Name   |
| ----------- | -------------- |
| `moba`      | MOBA Gamer     |
| `fps`       | FPS Gamer      |
| `rpg`       | RPG Gamer      |
| `sports`    | Sports Gamer   |
| `sandbox`   | Sandbox Gamer  |
| `mobile`    | Mobile Gamer   |
| `tabletop`  | Tabletop Gamer |

Use the internal IDs for all scoring logic.

Do not use numeric positions as canonical identifiers.

Legacy planning documents may use:

```text
1 → moba
2 → fps
3 → rpg
4 → sports
5 → sandbox
6 → mobile
7 → tabletop
```

---

# Scoring Model

Each answer directly awards points to gamer classes.

There is no intermediary attribute or personality-trait calculation.

Current provisional example:

```ts
{
  id: "q1-snooze",
  text: "Snoozed and missed one (or multiple) alarms.",
  scores: {
    moba: 1,
    fps: 1,
  },
}
```

Selecting this answer contributes:

```text
MOBA +1
FPS +1
```

and contributes zero points to all other classes.

---

# Weight Scale

The system supports weighted associations.

Recommended interpretation:

|        Weight | Meaning               |
| ------------: | --------------------- |
|           `3` | Strong association    |
|           `2` | Standard association  |
|           `1` | Secondary association |
| `0` / omitted | No association        |

Every association in the currently implemented ten-question draft uses a
provisional `+1` weight. This is a temporary content-integration value, not a
final statement about association strength. A later balancing pass may assign
intentional `1`, `2`, and `3` weights without changing the scoring engine.

These labels are authoring guidance, not participant-facing information.

Participants should not see:

* raw point values
* current score totals
* class probabilities
* intermediate class rankings

during the quiz.

---

# Question Structure

There are exactly ten questions in the current quiz.

All participants answer the same ten questions in the same order.

There is no branching.

The implemented sequence is:

```text
Q1 Wake Up
↓
Q2 Breakfast
↓
Q3 Commute
↓
Q4 First Class
↓
Q5 Open Lab
↓
Q6 Studying
↓
Q7 Club Sign-Ups
↓
Q8 Ingrid's Slack Message
↓
Q9 Evening Plans
↓
Q10 Bedtime
↓
Result
```

Each participant selects exactly one answer per question.

---

# Data Model

Recommended TypeScript representation:

```ts
export type GamerClassId =
  | "moba"
  | "fps"
  | "rpg"
  | "sports"
  | "sandbox"
  | "mobile"
  | "tabletop";

export interface QuizChoice {
  id: string;
  text: string;
  scores: Partial<Record<GamerClassId, number>>;
}

export interface QuizQuestion {
  id: string;
  title: string;
  scenario?: string;
  choices: QuizChoice[];
}
```

Example:

```ts
const question: QuizQuestion = {
  id: "q1",
  title: "You wake up to start your day… how do you wake up?",
  choices: [
    {
      id: "q1-snooze",
      text: "Snoozed and missed one (or multiple) alarms.",
      scores: {
        moba: 1,
        fps: 1,
      },
    },
    {
      id: "q1-made-bed",
      text: "Woke up and made my bed with plenty of time to get ready.",
      scores: {
        sandbox: 1,
        tabletop: 1,
      },
    },
    {
      id: "q1-all-nighter",
      text: "I pulled an all-nighter — I've been awake!",
      scores: {
        rpg: 1,
      },
    },
    {
      id: "q1-workout",
      text: "I've been up before dawn — gotta get a workout in.",
      scores: {
        sports: 1,
        mobile: 1,
      },
    },
  ],
};
```

These provisional `+1` weights remain subject to later balancing.

---

# Score Accumulation

Initialize every gamer class at zero.

Conceptually:

```ts
const totals = {
  moba: 0,
  fps: 0,
  rpg: 0,
  sports: 0,
  sandbox: 0,
  mobile: 0,
  tabletop: 0,
};
```

For every selected answer:

1. Read the choice's `scores`.
2. Add each contribution to the corresponding class total.
3. Continue until all ten questions have been answered.

Example path:

```text
Q1 → MOBA +1, FPS +1
Q2 → MOBA +1, FPS +1
Q3 → MOBA +1, RPG +1
Q4 → RPG +1, Mobile +1
...
```

The final totals determine the result.

---

# Primary Result Rule

After all ten answers are complete, determine the highest accumulated class score.

Hypothetical example after a future weighted balancing pass:

```text
MOBA      14
FPS       11
RPG        8
Sports     7
Sandbox   10
Mobile     6
Tabletop   9
```

Result:

```text
MOBA Gamer
```

---

# Tie-Breaking

Result calculation must always be deterministic.

Never choose randomly between tied classes.

Use the following rules in order.

## Tie-Break 1 — Strong Associations

Count how many selected answers gave each tied class a `+3` contribution.

The current provisional draft has no `+3` contributions, so every strong-
association count is initially zero. This tie-break remains available for a
later weighted balancing pass.

Hypothetical weighted example:

```text
MOBA total: 14
FPS total:  14

MOBA +3 contributions: 3
FPS +3 contributions:  2
```

Result:

```text
MOBA Gamer
```

---

## Tie-Break 2 — Distinct Question Contributions

If the classes remain tied, count how many different questions awarded that class at least one point.

Example:

```text
MOBA scored on 7 questions
FPS scored on 6 questions
```

Result:

```text
MOBA Gamer
```

This favors the class that was represented consistently across the participant's full response pattern.

---

## Tie-Break 3 — Fixed Priority

If the result is still tied, use a documented fixed priority.

Recommended initial priority:

```ts
export const GAMER_CLASS_TIE_PRIORITY: GamerClassId[] = [
  "moba",
  "fps",
  "rpg",
  "sports",
  "sandbox",
  "mobile",
  "tabletop",
];
```

This priority exists only to guarantee deterministic behavior.

It should not be interpreted as a ranking of class quality.

If future balancing shows that this priority materially affects result distribution, it may be changed intentionally.

Do not rely on implicit JavaScript object ordering.

---

# Gamer Character Stats

Each result class has predefined display statistics.

These statistics are separate from quiz scoring.

Current stat categories:

```ts
export interface GamerStats {
  teamwork: number;
  strategy: number;
  creativity: number;
  competitiveness: number;
  adaptability: number;
}
```

Suggested initial placeholder values:

| Class    | Teamwork | Strategy | Creativity | Competitiveness | Adaptability |
| -------- | -------: | -------: | ---------: | --------------: | -----------: |
| MOBA     |        9 |        9 |          6 |              10 |            8 |
| FPS      |        7 |        7 |          5 |              10 |            9 |
| RPG      |        7 |        9 |          8 |               5 |            7 |
| Sports   |        8 |        7 |          5 |               9 |            7 |
| Sandbox  |        6 |        7 |         10 |               4 |            9 |
| Mobile   |        5 |        6 |          7 |               6 |            8 |
| Tabletop |       10 |       10 |          8 |               7 |            6 |

These values are intentionally provisional.

They may be changed for:

* humor
* visual balance
* class characterization
* event activities
* character-sheet presentation

They must not affect which result a participant receives.

---

# Separation of Concerns

Keep these two systems independent.

## Classification

```text
Participant answers
→ weighted class points
→ class totals
→ tie-breaking
→ gamer class
```

## Presentation

```text
Gamer class
→ class name
→ artwork
→ description
→ predefined stats
→ result screen
```

Do not feed result-screen stats back into the classification algorithm.

---

# Current Question Mapping

Legacy question planning uses numbers in parentheses to identify classes.

Interpret them using:

```text
1 = MOBA
2 = FPS
3 = RPG
4 = Sports
5 = Sandbox
6 = Mobile
7 = Tabletop
```

These mappings identify intended associations only.

They do not automatically define final point weight.

For the implemented draft, every listed association is converted to a
provisional `+1`. For example, `(1, 2, 4)` currently becomes:

```ts
scores: {
  moba: 1,
  fps: 1,
  sports: 1,
}
```

A later balancing pass may assign different supported weights. For example:

```ts
scores: {
  moba: 2,
  fps: 1,
  sports: 3,
}
```

This future weighting would require an intentional balancing decision.

---

# Current Draft Status

The supplied ten-question draft is implemented with provisional `+1` class
associations. There are currently no unresolved class mappings in this draft.

## Question 9 Mapping

Question 9 Choice 1 is confirmed as legacy class `7`, which maps only to
`tabletop`. Its current score mapping is `{ tabletop: 1 }`.

---

## Unequal Association Counts

Some answers currently associate with:

* one class
* two classes
* three classes

This is permitted.

However, the quiz should eventually be analyzed to ensure one gamer class does not receive substantially more opportunities to score than others.

---

## Duplicate Opportunities Within One Question

A class may appear in multiple answers within the same question.

This is technically valid because a participant selects only one answer.

However, it may make that class easier to receive depending on how attractive those choices are.

Review this during balancing.

---

# Balancing Strategy

Do not attempt to force exactly equal numbers of participants into every class.

The primary goal should be:

> Each class should have a plausible and reasonably comparable path to winning.

Before the event, the quiz should be tested with simulated and human response data.

Useful balancing checks include:

* maximum possible score for each class
* number of answers capable of awarding each class points
* number of `+3` opportunities for each class
* average expected score under random responses
* percentage of simulated results belonging to each class
* frequency of ties
* frequency with which fixed-priority tie-breaking is reached

If one class dominates under random or realistic responses, adjust answer weights before changing the calculation algorithm.

---

# Suggested Validation Rules

Quiz data should eventually be validated for:

* exactly ten questions
* unique question IDs
* unique choice IDs
* at least two choices per question
* valid gamer-class IDs
* score weights within the supported range
* no negative weights unless intentionally added later
* every class appearing somewhere in the quiz
* every question containing at least one scoring answer

Validation may be implemented as tests rather than runtime checks if the quiz data is static and bundled with the application.

---

# Result Transparency

Participants do not need to see raw scoring.

The result screen may eventually explain the class in qualitative terms.

For example:

```text
MOBA Gamer

Your choices consistently leaned toward competitive,
team-oriented, high-energy decisions.
```

This explanation should come from authored class content, not from exposing raw internal score calculations.

---

# Non-Goals

The current scoring model does not include:

* intermediary personality traits
* psychological profiling
* branching questions
* dynamic class-stat generation
* randomized results
* machine learning
* forced cohort balancing
* adaptive questions

If any of these become requirements later, update this document before changing the implementation.

---

# Source of Truth

For result calculation, the source of truth is:

```text
question choice score mappings in
src/features/personality-test/data/questions.ts
+
deterministic tie-breaking rules
```

For final character presentation, the source of truth is:

```text
gamer-class metadata
```

Do not conflate the two.
