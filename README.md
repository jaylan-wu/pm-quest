# Choose Your Character

A browser-based personality quiz for a game-themed peer mentor / teaching assistant training event. Participants complete ten linear questions, and each answer awards hidden weighted points directly to one or more of seven gamer classes. Results use deterministic comparison rules, while each class's presentation stats remain static and independent of quiz scoring.

## Getting started

Install dependencies and start the Vite development server:

```bash
yarn install
yarn dev
```

## Commands

```bash
yarn dev        # Start the development server
yarn lint       # Run ESLint
yarn typecheck  # Check TypeScript types
yarn test       # Run tests in watch mode
yarn test:run   # Run tests once
yarn build      # Create a production build
```

Run the complete verification set before considering a change finished:

```bash
yarn lint
yarn typecheck
yarn test:run
yarn build
```

## Project documentation

- [Product](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Scoring](docs/SCORING.md)
