# AGENTS.md

## Project Overview

This repository contains a browser-based personality quiz for a game-themed peer mentor / teaching assistant training event.

Participants complete a 10-question experience titled around a "Day in the Life of a Peer Mentor."

Each answer awards hidden weighted points directly to one or more gamer classes. At the end of the quiz, the participant is assigned the gamer class with the strongest result.

The quiz is intended to be playful and event-focused rather than a scientifically validated personality assessment.

The current priority is a maintainable quiz engine and data model. Visual design, final score balancing, class artwork, and some written content may continue to evolve.

---

## Gamer Classes

The application has exactly seven gamer classes.

Use these stable internal IDs:

```ts
export type GamerClassId =
  | "moba"
  | "fps"
  | "rpg"
  | "sports"
  | "sandbox"
  | "mobile"
  | "tabletop";
```

Display names:

| ID         | Display Name   |
| ---------- | -------------- |
| `moba`     | MOBA Gamer     |
| `fps`      | FPS Gamer      |
| `rpg`      | RPG Gamer      |
| `sports`   | Sports Gamer   |
| `sandbox`  | Sandbox Gamer  |
| `mobile`   | Mobile Gamer   |
| `tabletop` | Tabletop Gamer |

Do not use array position or numeric class IDs as the application's canonical representation.

Legacy numerical mappings may appear in planning material:

```text
1 → moba
2 → fps
3 → rpg
4 → sports
5 → sandbox
6 → mobile
7 → tabletop
```

Convert these to stable string IDs when implementing application data.

---

## Current Quiz Structure

The quiz contains exactly ten questions.

The current flow is linear:

```text
Landing
→ Question 1
→ Question 2
→ Question 3
→ Question 4
→ Question 5
→ Question 6
→ Question 7
→ Question 8
→ Question 9
→ Question 10
→ Result
```

There is no branching in the current product specification.

Do not introduce:

* conditional question routes
* hidden alternate questions
* story branches
* branching state flags

unless the product specification is explicitly changed later.

---

## Scoring Architecture

Quiz choices award points directly to gamer classes.

There is no intermediary personality-trait scoring layer.

The scoring pipeline is:

```text
answer choice
→ gamer-class score contribution
→ accumulated gamer-class totals
→ deterministic comparison
→ resulting gamer class
```

A choice may award points to one or multiple classes.

Example:

```ts
{
  id: "q1-snooze",
  text: "Snoozed and missed one or multiple alarms.",
  scores: {
    moba: 2,
    fps: 2,
  },
}
```

Supported score weights are conceptually:

```text
3 = strong association
2 = standard association
1 = secondary association
```

A missing class entry means zero points.

The exact score values are configuration data and may be rebalanced later.

Do not hardcode scoring logic into React components.

See `docs/SCORING.md` for the scoring specification.

---

## Gamer Stats

Every resulting gamer class has predefined character statistics for presentation on the result screen.

The current stat model is:

```ts
export interface GamerStats {
  teamwork: number;
  strategy: number;
  creativity: number;
  competitiveness: number;
  adaptability: number;
}
```

These values may be fictionalized and are primarily intended to support the game-character presentation.

Important:

**Gamer stats do not affect quiz scoring or result calculation.**

They are static metadata associated with each class.

Do not calculate these stats from participant answers unless the product specification is explicitly changed.

---

## Technology

The current application stack is expected to use:

* React
* TypeScript
* Vite
* React Router
* React Context and/or `useReducer`
* CSS with shared design tokens
* Vitest
* React Testing Library
* ESLint

Use the package manager already configured in the repository.

Do not change package managers without explicit instruction.

---

## Repository Organization

Prefer feature-oriented organization.

Application-wide configuration belongs in:

```text
src/app/
```

Route-level screens belong in:

```text
src/pages/
```

Quiz behavior belongs in:

```text
src/features/personality-test/
```

Quiz data should remain separate from rendering logic.

A typical feature structure may resemble:

```text
src/features/personality-test/
├── components/
├── data/
│   ├── gamerClasses.ts
│   └── questions.ts
├── state/
├── utils/
│   └── calculateResult.ts
└── types.ts
```

Global styling belongs in:

```text
src/styles/
```

Browser-served question image assets belong in:

```text
public/assets/questions/
```

Project documentation belongs in:

```text
docs/
```

Do not create generic shared abstractions until multiple real consumers justify them.

---

## Data-Driven Content

Questions, choices, gamer classes, score mappings, and gamer stats must be represented as data.

Presentation components should not contain question-specific scoring behavior.

Recommended question types:

```ts
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

Recommended class types:

```ts
export interface GamerStats {
  teamwork: number;
  strategy: number;
  creativity: number;
  competitiveness: number;
  adaptability: number;
}

export interface GamerClass {
  id: GamerClassId;
  name: string;
  description: string;
  stats: GamerStats;
}
```

These interfaces may evolve as the UI develops, but preserve the separation between:

* quiz scoring data
* class metadata
* presentation logic

---

## State Management

Keep quiz state minimal.

The application may track:

* current question index
* selected answers
* quiz completion state
* result

Class totals should preferably be derived from selected answers when this keeps the state model simpler and prevents duplicated state.

Avoid storing the same information in multiple representations unless required for a clear performance or architectural reason.

Do not introduce Redux, Zustand, or another external state-management library without demonstrated need.

---

## Result Calculation

Result calculation must be implemented using pure functions.

Given identical question data and identical participant answers, the application must always produce the same result.

Random result selection is prohibited.

Tie-breaking order:

1. Highest accumulated gamer-class score.
2. Most `+3` contributions.
3. Most distinct questions contributing points to that class.
4. Fixed deterministic class priority.

The final priority must be explicitly defined and documented.

Do not rely on JavaScript object ordering or incidental array ordering as an undocumented tie-breaker.

---

## TypeScript Conventions

* Keep strict TypeScript enabled.
* Avoid `any`.
* Prefer explicit domain types.
* Use stable string IDs.
* Prefer discriminated unions for reducer actions.
* Give exported utility functions clear return types.
* Prefer descriptive names over abbreviations.
* Avoid TypeScript enums unless they provide a specific advantage.
* Do not encode domain behavior through unexplained magic numbers.

---

## Component Expectations

Keep components focused on presentation or orchestration.

Prefer:

* typed props
* semantic HTML
* reusable quiz controls
* composition

Avoid:

* scoring calculations inside buttons
* direct mutation of quiz data
* question-specific conditionals spread across components
* clickable `div` elements when semantic controls exist

All interactive functionality must remain keyboard accessible.

Visible focus states are required.

---

## Styling

The visual direction may evolve as the game-night theme is developed.

Keep foundational styling easy to reskin.

Use shared CSS custom properties for reusable design values such as:

* colors
* spacing
* typography
* borders
* shadows
* motion timing

Do not scatter unexplained hardcoded design values throughout components.

Support desktop and mobile layouts.

Respect `prefers-reduced-motion` when animations are introduced.

---

## Testing

Test behavior and domain rules rather than implementation details.

Important test coverage includes:

* starting the quiz
* answering a question
* progressing between questions
* handling all ten questions
* one answer contributing to one class
* one answer contributing to multiple classes
* score accumulation
* result calculation
* every tie-breaking stage
* reset behavior
* direct access to the result route without completed quiz data
* predefined gamer stats not changing quiz outcomes

Every scoring bug fix should include a regression test.

---

## Documentation

Use:

```text
README.md
```

for repository setup and common commands.

Use:

```text
docs/SCORING.md
```

for class scoring, weighting, balancing, and tie-breaking.

Use other documents under:

```text
docs/
```

for architecture or product decisions when needed.

Update documentation when the underlying architecture or product rules change.

Do not use `AGENTS.md` as a scratchpad.

---

## Development Workflow

Before making substantial changes:

1. Read this file.
2. Inspect the relevant implementation.
3. Inspect relevant documentation.
4. Identify the smallest coherent change.
5. Preserve existing working behavior outside the requested scope.
6. Update tests.
7. Run relevant verification commands.
8. Review the final diff for unrelated changes.

Do not refactor unrelated code simply because another structure is preferred.

Do not automatically rebalance quiz scores while implementing unrelated features.

If ambiguous scoring data is encountered, flag it rather than silently inventing permanent product behavior.

---

## Verification

Before considering a substantial implementation task complete, run the repository's equivalents of:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

If scripts differ, use the scripts defined by the repository rather than changing them unnecessarily.

---

## Out of Scope Unless Explicitly Requested

Do not add:

* a backend
* a database
* user accounts
* authentication
* analytics
* external APIs
* branching quiz paths
* randomized results
* machine-learning classification
* new state-management frameworks

unless explicitly required by a later task.

---

## Definition of Done

A task is complete when:

* requested behavior works
* quiz scoring remains deterministic
* TypeScript passes
* linting passes
* relevant tests pass
* the production build succeeds
* accessibility is preserved
* unrelated behavior is unchanged
* documentation reflects meaningful architectural changes
* unresolved content or scoring ambiguities are reported
