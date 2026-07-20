import { createContext, type Dispatch } from 'react'

import type {
  TestSessionAction,
  TestSessionState,
} from './sessionReducer'
import type { ScoreSummary } from './types'

export interface TestSessionContextValue {
  readonly state: TestSessionState
  readonly accumulatedScores: ScoreSummary
  readonly dispatch: Dispatch<TestSessionAction>
}

export const TestSessionContext =
  createContext<TestSessionContextValue | null>(null)
