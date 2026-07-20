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
/result     Completed character result
```

The result route must not assume valid session data. It redirects to the landing page or presents a clear restart action when no completed result exists.

## Data and state flow

Questions, choices, traits, and characters are typed configuration rather than component-specific logic. Route screens compose presentation components and supply the relevant content through typed props.

The session provider exposes state, live accumulated scores, and explicit reducer actions for starting, answering, advancing, completing, calculating a result, and resetting. The reducer coordinates the session; pure scoring functions perform score accumulation and result matching. Accumulated scores are derived from selected answers at the context boundary instead of being duplicated in reducer state, preventing the two values from drifting apart.

The initial flow is entirely client-side and in memory. Story metadata and flags may extend the domain later without changing the current routes or presentation structure.

## Testing and dependencies

Unit tests cover reducer transitions, invalid advancement, completion, reset, result calculation, and deterministic ties. Route and interaction tests should use accessible queries and test behavior rather than implementation details.

Production dependencies remain limited to React, React DOM, and React Router until another dependency addresses a demonstrated requirement.
