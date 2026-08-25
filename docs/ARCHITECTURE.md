# Architecture

## Technology and boundaries

The application uses React, TypeScript, Vite, and React Router. React Context with `useReducer` owns the in-memory personality-test session. Plain CSS and shared custom properties provide the styling foundation. Vitest, jsdom, and React Testing Library cover behavior.

```text
src/app/                       Application setup, routing, and providers
src/pages/                     Route-level screens
src/features/personality-test/ Domain types, content, session state, scoring, and feature tests
src/styles/                    Global styles and reusable design tokens
docs/                          Product and technical decisions
```

Feature-owned components and helpers stay with the personality-test feature. A root-level generic component or utility directory should be introduced only when multiple features genuinely share the code.

## Routes

```text
/           Landing page
/adventure  Question flow
/result     Completed gamer-class result
```

The result route must not assume valid session data. It redirects to the landing page or presents a clear restart action when no completed result exists.

## Data and state flow

Questions, choices, score mappings, and gamer classes are typed configuration rather than component-specific logic. The seven classes use stable string IDs: `moba`, `fps`, `rpg`, `sports`, `sandbox`, `mobile`, and `tabletop`. Each choice contains a partial mapping of those IDs to hidden weights, allowing one answer to contribute directly to one or more classes. Route screens compose presentation components and never expose those weights.

The session provider owns the current question index, selected answers, completion state, and final result. Explicit reducer actions start, answer, advance, complete, and reset the quiz. Class totals are derived from selected answers rather than duplicated in reducer state, preventing the values from drifting apart.

Pure scoring functions accumulate direct class contributions and compare candidates in four deterministic stages: highest total score, most `+3` contributions, most distinct questions contributing points, and a centrally defined fixed class priority. The same question data and answers therefore always produce the same result. There is no intermediary trait layer or random selection.

Gamer-class metadata contains authored descriptions and predefined teamwork, strategy, creativity, competitiveness, and adaptability stats. The result screen reads these values for presentation only; they are never inputs to score accumulation or winner selection.

The flow is entirely client-side, linear, and in memory: landing, ten ordered questions, then result. The domain has no story flags, conditional question paths, or branching routes.

## Testing and dependencies

Unit tests cover reducer transitions, invalid advancement, all ten questions, completion, reset, direct and multi-class contributions, score accumulation, each deterministic comparison stage, and the separation of presentation stats from scoring. Route and interaction tests cover the complete flow and safe direct result access using accessible queries and behavior rather than implementation details.

Production dependencies remain limited to React, React DOM, and React Router until another dependency addresses a demonstrated requirement.
