# Architecture

## Technology and boundaries

The application uses React, TypeScript, Vite, and React Router. React Context with `useReducer` owns the in-memory personality-test session. Plain CSS and shared custom properties provide the styling foundation. Vitest, jsdom, and React Testing Library cover behavior.

```text
public/assets/questions/       Browser-served question images
src/app/                       Application setup, routing, and providers
src/pages/                     Route-level screens
src/features/personality-test/ Domain types, content, session state, scoring, and feature tests
src/styles/                    Global styles and reusable design tokens
docs/                          Product and technical decisions
```

Feature-owned components and helpers stay with the personality-test feature. A root-level generic component or utility directory should be introduced only when multiple features genuinely share the code.

## Routes

```text
/             Landing page
/adventure    Question flow
/result       Completed gamer-class result
/gamer-types  Public directory of all gamer classes
```

The result route must not assume valid session data. It redirects to the landing page or presents a clear restart action when no completed result exists.

The gamer-types directory is safe to visit directly and does not require a
completed quiz. When the in-memory session contains a completed result, the
directory compares its stable gamer-class ID with the listed classes and marks
that card as the participant's current type. This highlight is intentionally
session-only; the feature does not add persistence or a second representation
of the result. The result page links to the directory, and the directory offers
an action to take or retake the quiz.

## Data and state flow

Questions, choices, score mappings, and gamer classes are typed configuration rather than component-specific logic. The seven classes use stable string IDs: `moba`, `fps`, `rpg`, `sports`, `sandbox`, `mobile`, and `tabletop`. Each choice contains a partial mapping of those IDs to hidden weights, allowing one answer to contribute directly to one or more classes. Route screens compose presentation components and never expose those weights.

The session provider owns the current question index, selected answers, completion state, and final result. Explicit reducer actions start, answer, advance, complete, and reset the quiz. Class totals are derived from selected answers rather than duplicated in reducer state, preventing the values from drifting apart.

Pure scoring functions accumulate direct class contributions and compare candidates in four deterministic stages: highest total score, most `+3` contributions, most distinct questions contributing points, and a centrally defined fixed class priority. The same question data and answers therefore always produce the same result. There is no intermediary trait layer or random selection.

`src/features/personality-test/data/gamerClasses.ts` is the canonical source of
gamer-class presentation metadata: stable IDs, display names, authored
descriptions, and predefined teamwork, strategy, creativity, competitiveness,
and adaptability stats. Scoring resolves its winner against this data, while
the result screen and gamer-types directory render it directly. The static
stats remain presentation-only and are never inputs to score accumulation or
winner selection.

The flow is entirely client-side, linear, and in memory: landing, ten ordered questions, then result. The domain has no story flags, conditional question paths, or branching routes.

## Responsive Layout

Styles use mobile-first defaults for the quiz, result, and gamer-types
directory. Narrow viewports receive a single content column, stacked actions,
full-width answer controls, and compact outer spacing. Progressive enhancement
begins at `48rem` for tablet and desktop spacing and layout. A `64rem`
breakpoint is reserved for genuinely wider arrangements such as the
gamer-types card grid; it does not redesign the established desktop quiz.

Page shells use dynamic viewport-height units where useful without fixing
content to one screen. Content may scroll vertically, and page-edge spacing
accounts for safe-area insets on devices with notches or home indicators.
Interactive controls preserve practical touch targets of at least 44 CSS
pixels, visible keyboard focus, and pressed or selected feedback. Motion uses
the shared timing tokens and respects `prefers-reduced-motion`.

## Question Image Assets

Question images belong in `public/assets/questions/`, using the exact
filenames documented in that directory's `README.md`: `question-01.webp`
through `question-10.webp`. These public assets may be added or replaced
without changing imports, and their absence does not prevent a build; the
question UI retains its 16:9 frame and displays a styled placeholder when a
source is unavailable.

Image metadata is configured alongside each question in
`src/features/personality-test/data/questions.ts`. Use optimized WebP images
with a consistent 16:9 landscape composition. The reusable image slot fills
its frame with `object-fit: cover` rather than stretching the artwork. The
optional `image.position` accepts any CSS-compatible `object-position` value
(for example, `"50% 35%"`) and defaults to `center`. Alt text must be authored
for the supplied image rather than derived from its filename; use `alt: ""`
only when the image is purely decorative.

## Testing and dependencies

Unit tests cover reducer transitions, invalid advancement, all ten questions, completion, reset, direct and multi-class contributions, score accumulation, each deterministic comparison stage, and the separation of presentation stats from scoring. Route and interaction tests cover the complete flow, safe direct result access, direct gamer-types access, result-to-directory navigation, current-result highlighting when available, and image fallback behavior using accessible queries rather than implementation details.

Production dependencies remain limited to React, React DOM, and React Router until another dependency addresses a demonstrated requirement.
