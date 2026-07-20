# AGENTS.md

## Project overview

This repository contains a browser-based choose-your-adventure personality test for a game-themed teaching assistant training event.

Participants answer eight scenario-based questions. Their choices are evaluated using hidden scoring rules, and the application assigns them a starter character or character class at the end.

The specific story, questions, visual theme, and final character roster are still being developed. Build the application so this content can be replaced without restructuring the UI.

## Current project stage

The project is currently establishing its core architecture and user flow.

Current priorities:

1. Establish a maintainable React application structure.
2. Build a complete landing-to-result flow using placeholder content.
3. Separate personality-test content from presentation components.
4. Implement deterministic and testable scoring.
5. Establish accessible, responsive UI foundations.
6. Avoid premature visual polish and unnecessary dependencies.

## Technology

* React
* TypeScript
* Vite
* React Router
* React Context and `useReducer` for test-session state
* Plain CSS with shared design tokens
* Vitest
* React Testing Library
* ESLint

Do not introduce additional production dependencies unless they solve a demonstrated requirement.

## Commands

Use Yarn as the package manager.

```bash
yarn install
yarn dev
yarn build
yarn lint
yarn test
yarn test:run
yarn typecheck
```

Before considering work complete, run:

```bash
yarn lint
yarn typecheck
yarn test:run
yarn build
```

## Repository structure

Application-wide setup belongs in:

```text
src/app/
```

Route-level screens belong in:

```text
src/pages/
```

Personality-test behavior belongs in:

```text
src/features/personality-test/
```

Global styles and reusable design tokens belong in:

```text
src/styles/
```

Project decisions and feature documentation belong in:

```text
docs/
```

Keep files close to the feature that owns them. Do not create a generic `utils/` or `components/` directory at the root of `src` unless the code is genuinely shared by multiple features.

## Application routes

The initial routes are:

```text
/           Landing page
/adventure  Personality-test flow
/result     Final character result
```

The result route must handle missing session data safely. A user who directly visits `/result` without completing the test should be redirected to the landing page or shown a clear restart action.

## Core domain model

The personality test must be data-driven.

A question should contain:

* A stable ID
* A title
* Scenario text
* Optional narrative metadata
* An ordered collection of choices

A choice should contain:

* A stable ID
* Display text
* Trait or character scoring effects
* Optional narrative effects

A character result should contain:

* A stable ID
* Name
* Title or class
* Description
* Strengths
* Growth area
* Primary and secondary traits
* Optional image and ability metadata

Do not hardcode question-specific behavior inside React components.

## State management

Use React Context with `useReducer` for the initial implementation.

The test session should track:

* Current question index
* Selected answers
* Accumulated scores
* Whether the test is complete
* Calculated result
* Optional story flags for future branching

State transitions should use explicit reducer actions.

Do not store derived values when they can be calculated reliably from existing state.

Do not add Redux, Zustand, or another state-management library during the initial implementation.

## Scoring rules

Scoring logic must be implemented as pure functions.

Given the same answers and configuration, result calculation must always return the same result.

Tie-breaking behavior must be explicit and tested. Do not rely on object ordering, array accidents, random values, or UI state to resolve ties.

Keep scoring configuration in data files and calculation behavior in utility modules.

Document significant scoring decisions in `docs/SCORING.md`.

## Component expectations

Components should be small and focused.

Prefer composition over large components with many conditional branches.

Presentation components should receive their content through typed props. They should not import the complete question or character datasets unless they are responsible for orchestrating that data.

Use semantic HTML before adding ARIA attributes.

All interactive controls must be keyboard accessible and show a visible focus state.

Do not make clickable `div` elements when a `button` or `a` element is appropriate.

## TypeScript conventions

* Keep TypeScript strict.
* Avoid `any`.
* Prefer `unknown` when external data has not been validated.
* Define domain types in the feature’s `types.ts`.
* Use discriminated unions for reducer actions.
* Give exported functions explicit return types.
* Prefer descriptive names over abbreviations.
* Do not use TypeScript enums unless there is a demonstrated advantage over string unions or constant objects.

## Styling

Use CSS custom properties in `src/styles/tokens.css` for:

* Colors
* Spacing
* Typography
* Borders
* Shadows
* Motion durations
* Breakpoints where appropriate

Do not scatter unexplained color values throughout component files.

The final game-night visual direction has not been chosen. Keep the initial interface intentionally neutral and easy to reskin.

Support mobile and desktop layouts.

Respect `prefers-reduced-motion` when animation is introduced.

## Testing

Test behavior rather than implementation details.

At minimum, include tests for:

* Starting a new test
* Selecting a choice
* Advancing to the next question
* Preventing invalid advancement
* Completing all eight questions
* Calculating a result
* Deterministic tie-breaking
* Restarting the test
* Visiting the result page without completed test data

Use accessible queries such as role, label, and visible text whenever possible.

Every scoring bug fix should include a regression test.

## Working process

Before making substantial changes:

1. Inspect the relevant files.
2. Summarize the current behavior.
3. Identify assumptions or conflicts.
4. Make the smallest coherent change.
5. Add or update tests.
6. Run the relevant verification commands.
7. Review the final diff for unrelated changes.

Do not rewrite functioning code only to match a personal preference.

Do not change package managers.

Do not modify generated lockfiles manually.

Do not add a backend, database, authentication system, analytics platform, or external API unless the task explicitly requires it.

## Documentation

Update documentation when behavior or architectural decisions change.

Use:

* `README.md` for setup and common commands.
* `docs/PRODUCT.md` for the experience, audience, and requirements.
* `docs/ARCHITECTURE.md` for technical boundaries and decisions.
* `docs/SCORING.md` for traits, scoring, matching, and tie-breaking.

Do not place temporary implementation notes in `AGENTS.md`.

## Definition of done

A task is complete only when:

* The requested behavior works.
* TypeScript reports no errors.
* Linting passes.
* Relevant tests pass.
* The production build succeeds.
* New UI is keyboard accessible.
* No unrelated files were changed.
* Documentation is updated when required.
* The final response summarizes the changes and verification performed.
