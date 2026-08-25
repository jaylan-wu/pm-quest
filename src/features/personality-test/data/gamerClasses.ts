import type { GamerClass } from '../types'

export const gamerClasses = [
  {
    id: 'moba',
    name: 'MOBA Gamer',
    description: 'Coordinates with a team and keeps the shared objective in view.',
    stats: {
      teamwork: 9,
      strategy: 9,
      creativity: 6,
      competitiveness: 10,
      adaptability: 8,
    },
  },
  {
    id: 'fps',
    name: 'FPS Gamer',
    description: 'Responds quickly, stays alert, and adjusts when the situation changes.',
    stats: {
      teamwork: 7,
      strategy: 7,
      creativity: 5,
      competitiveness: 10,
      adaptability: 9,
    },
  },
  {
    id: 'rpg',
    name: 'RPG Gamer',
    description: 'Invests in a thoughtful plan and helps every role grow over time.',
    stats: {
      teamwork: 7,
      strategy: 9,
      creativity: 8,
      competitiveness: 5,
      adaptability: 7,
    },
  },
  {
    id: 'sports',
    name: 'Sports Gamer',
    description: 'Builds momentum through teamwork, practice, and friendly competition.',
    stats: {
      teamwork: 8,
      strategy: 7,
      creativity: 5,
      competitiveness: 9,
      adaptability: 7,
    },
  },
  {
    id: 'sandbox',
    name: 'Sandbox Gamer',
    description: 'Experiments freely and finds creative possibilities in open-ended problems.',
    stats: {
      teamwork: 6,
      strategy: 7,
      creativity: 10,
      competitiveness: 4,
      adaptability: 9,
    },
  },
  {
    id: 'mobile',
    name: 'Mobile Gamer',
    description: 'Makes useful progress in the moment and adapts to the time available.',
    stats: {
      teamwork: 5,
      strategy: 6,
      creativity: 7,
      competitiveness: 6,
      adaptability: 8,
    },
  },
  {
    id: 'tabletop',
    name: 'Tabletop Gamer',
    description: 'Brings people together through communication, planning, and shared play.',
    stats: {
      teamwork: 10,
      strategy: 10,
      creativity: 8,
      competitiveness: 7,
      adaptability: 6,
    },
  },
] as const satisfies readonly GamerClass[]
