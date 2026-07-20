import type { CharacterResult } from '../types'

export const characters = [
  {
    id: 'guide',
    name: 'Guide',
    title: 'Support class',
    description: 'Helps a group work together.',
    strengths: ['Listening', 'Coordination'],
    growthArea: 'Acting with limited input.',
    primaryTrait: 'collaboration',
    secondaryTrait: 'adaptability',
  },
  {
    id: 'planner',
    name: 'Planner',
    title: 'Strategy class',
    description: 'Creates a clear path through a task.',
    strengths: ['Organization', 'Focus'],
    growthArea: 'Changing a plan quickly.',
    primaryTrait: 'structure',
    secondaryTrait: 'collaboration',
  },
  {
    id: 'adapter',
    name: 'Adapter',
    title: 'Flexible class',
    description: 'Responds calmly when conditions change.',
    strengths: ['Experimentation', 'Recovery'],
    growthArea: 'Setting direction early.',
    primaryTrait: 'adaptability',
    secondaryTrait: 'structure',
  },
] as const satisfies readonly CharacterResult[]

export const characterTieBreakOrder = ['guide', 'planner', 'adapter'] as const
