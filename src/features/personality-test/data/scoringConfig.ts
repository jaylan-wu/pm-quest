import type { GamerClassId, ScoringConfig } from '../types'

export const GAMER_CLASS_TIE_PRIORITY = [
  'moba',
  'fps',
  'rpg',
  'sports',
  'sandbox',
  'mobile',
  'tabletop',
] as const satisfies readonly GamerClassId[]

export const scoringConfig = {
  gamerClassTieBreakOrder: GAMER_CLASS_TIE_PRIORITY,
} as const satisfies ScoringConfig
