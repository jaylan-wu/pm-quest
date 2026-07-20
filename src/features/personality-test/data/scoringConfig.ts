import type { ScoringConfig } from '../types'
import { characterTieBreakOrder } from './characters'

export const scoringConfig = {
  primaryTraitWeight: 2,
  secondaryTraitWeight: 1,
  characterTieBreakOrder,
} as const satisfies ScoringConfig
