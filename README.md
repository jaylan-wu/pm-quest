# Day in the Life of a Peer Mentor

A browser-based, game-themed personality quiz for a peer mentor / teaching
assistant training event. Participants navigate ten moments in a peer mentor's
day and receive one of seven gamer classes through deterministic, data-driven
scoring.

The quiz is a playful event activity, not a scientifically validated
personality assessment.

## Experience

- Ten ordered scenario questions with one required response per question
- A linear flow with visible progress and no branching routes
- Responsive question artwork with authored alt text and a graceful fallback
- One deterministic result from seven gamer classes
- A result screen with a class description and five balanced character stats
- Retake controls and a directory where participants can browse every class
- Keyboard-accessible controls, visible focus states, responsive layouts, dark
  mode, and reduced-motion support

Quiz progress and results live only in memory. Reloading the application starts
a fresh session; there are no accounts, analytics, backend services, or stored
participant data.

## Gamer classes

| Internal ID | Display name |
| --- | --- |
| `moba` | MOBA Gamer |
| `fps` | FPS Gamer |
| `rpg` | RPG Gamer |
| `sports` | Sports Gamer |
| `sandbox` | Sandbox Gamer |
| `mobile` | Mobile Gamer |
| `tabletop` | Tabletop Gamer |

## Scoring

Each answer awards hidden weighted points directly to one or more gamer
classes. There is no intermediary personality-trait layer and no random result
selection. Ties are resolved in this fixed order:

1. Highest accumulated class score
2. Most `+3` contributions
3. Most distinct questions contributing to the class
4. Explicit class priority from the scoring configuration

Character stats are static presentation metadata and never affect the quiz
result. Each class currently has 37 total points across teamwork, strategy,
creativity, competitiveness, and adaptability, giving every class the same 7.4
average.

See [Scoring](docs/SCORING.md) for the full data model and tie-breaking rules.

## Technology

- React and TypeScript
- Vite
- React Router with hash-based routing
- React Context and `useReducer` for in-memory session state
- CSS custom properties for shared design tokens
- Vitest, jsdom, and React Testing Library
- ESLint

## Getting started

Use Node.js 24 to match the deployment environment and Yarn Classic 1.22.22,
which is declared in `package.json`. No environment variables are required.

```bash
yarn install
yarn dev
```

Vite prints the local development URL after the server starts.

## Commands

| Command | Purpose |
| --- | --- |
| `yarn dev` | Start the Vite development server |
| `yarn build` | Type-check and create the production build in `dist/` |
| `yarn preview` | Preview the production build locally |
| `yarn lint` | Run ESLint |
| `yarn typecheck` | Check TypeScript types |
| `yarn test` | Run Vitest in watch mode |
| `yarn test:run` | Run the test suite once |

Run the complete verification set before considering a change finished:

```bash
yarn lint
yarn typecheck
yarn test:run
yarn build
```

## Routes and session behavior

The application uses `HashRouter` so navigation works from its GitHub Pages
subpath.

| Hash route | Screen |
| --- | --- |
| `#/` | Landing page |
| `#/adventure` | Active question flow |
| `#/result` | Completed gamer-class result |
| `#/gamer-types` | Directory of all gamer classes |

The adventure route requires a started session, and the result route requires
a completed quiz. Invalid or incomplete direct visits return safely to the
landing page. The gamer-class directory is always available and highlights the
participant's result when one exists in the current session.

## Project structure

```text
public/assets/questions/       Question artwork and asset instructions
src/app/                       Application routing and provider setup
src/pages/                     Route-level screens
src/features/personality-test/ Quiz data, components, state, and scoring
src/styles/                    Global CSS and shared design tokens
src/test/                      Test environment setup
docs/                          Product and technical documentation
```

Important content and behavior live in:

- `src/features/personality-test/data/questions.ts` — question copy, choices,
  image metadata, and score contributions
- `src/features/personality-test/data/gamerClasses.ts` — canonical class names,
  descriptions, and static stats
- `src/features/personality-test/data/scoringConfig.ts` — deterministic final
  tie priority
- `src/features/personality-test/scoring.ts` — pure score accumulation and
  result calculation
- `src/features/personality-test/sessionReducer.ts` — linear quiz state
  transitions

Question artwork belongs in `public/assets/questions/` using the filenames
`question-01.webp` through `question-10.webp`. See the
[question image instructions](public/assets/questions/README.md) for sizing,
crop, and alternative-text guidance.

## Deployment

The GitHub Pages workflow in `.github/workflows/deploy-pages.yml` builds and
deploys `dist/` on pushes to `main` or through a manual workflow dispatch. Vite
uses `/pm-quest/` as its production base path; update `vite.config.ts` if the
repository is deployed under a different path.

## Project documentation

- [Product](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design](docs/DESIGN.md)
- [Scoring](docs/SCORING.md)
