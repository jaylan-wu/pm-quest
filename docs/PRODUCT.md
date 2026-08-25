# Product

## Purpose and audience

Choose Your Character is a short, browser-based personality quiz for participants in a game-themed peer mentor / teaching assistant training event. It assigns each participant one of seven gamer classes based on ten scenario questions.

The quiz is playful and event-focused rather than a scientifically validated assessment. Wording, score balance, artwork, and visual design may evolve without changing the core quiz flow or scoring architecture.

## Experience

1. The landing page introduces the activity and starts a new session.
2. The quiz presents exactly ten ordered questions, one at a time, with no branching.
3. The participant selects an answer before advancing.
4. Each selected answer awards hidden weighted points directly to one or more gamer classes.
5. Completing the final question determines the result through four ordered comparisons: highest total, most `+3` contributions, most distinct contributing questions, then fixed class priority.
6. The result page presents the winning gamer class, its authored description and static stats, a primary way to restart, and a secondary action to view all gamer types.
7. The gamer-types directory presents all seven canonical classes and provides a way to take or retake the quiz.

A direct visit to the result page without a completed session must return the participant to a safe starting point or clearly offer a restart.

The gamer-types directory is available through `/gamer-types` whether or not a
quiz has been completed. If a completed result is available in the current
in-memory session, its matching card is visibly labeled as the participant's
type. All other types remain equally accessible. Reloading the application may
clear this highlight because the quiz does not persist participant state.

## Requirements

- Keep question score mappings and gamer-class metadata separate from presentation code.
- Use `src/features/personality-test/data/gamerClasses.ts` as the single source of gamer-class names, descriptions, and static stats for both individual results and the directory.
- Use the seven stable gamer-class IDs defined in the scoring specification.
- Derive class totals from selected answers instead of storing duplicate score state.
- Produce the same result for the same answers and configuration.
- Keep gamer-class teamwork, strategy, creativity, competitiveness, and adaptability stats as static presentation metadata. These stats never affect quiz scoring or the result.
- Treat mobile as the default layout, with readable single-column quiz and directory screens, landscape question-image slots, full-width answer choices, and touch targets of at least 44 CSS pixels.
- Progressively enhance spacing and layout at approximately `48rem` and wider directory grids at `64rem`, while preserving the established desktop quiz.
- Support keyboard use, visible focus and selection states, semantic controls, safe-area spacing, dynamic viewport heights, reduced motion, and mobile and desktop layouts.
- Keep the interface visually neutral and easy to reskin.
- Avoid back-end services, accounts, persistence, analytics, conditional questions, and branching narrative unless explicitly required later.
