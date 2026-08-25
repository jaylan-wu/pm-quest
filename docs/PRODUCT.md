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
6. The result page presents the winning gamer class, its authored description and static stats, and a way to restart.

A direct visit to the result page without a completed session must return the participant to a safe starting point or clearly offer a restart.

## Requirements

- Keep question score mappings and gamer-class metadata separate from presentation code.
- Use the seven stable gamer-class IDs defined in the scoring specification.
- Derive class totals from selected answers instead of storing duplicate score state.
- Produce the same result for the same answers and configuration.
- Keep gamer-class teamwork, strategy, creativity, competitiveness, and adaptability stats as static presentation metadata. These stats never affect quiz scoring or the result.
- Support keyboard use, visible focus states, semantic controls, and mobile and desktop layouts.
- Keep the interface visually neutral and easy to reskin.
- Avoid back-end services, accounts, persistence, analytics, conditional questions, and branching narrative unless explicitly required later.
