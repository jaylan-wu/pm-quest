import { useReducer, type PropsWithChildren, type ReactElement } from 'react'

import { questions } from './data/questions'
import { calculateScores } from './scoring'
import { TestSessionContext } from './sessionContext'
import {
  initialTestSessionState,
  testSessionReducer,
} from './sessionReducer'

export function TestSessionProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [state, dispatch] = useReducer(
    testSessionReducer,
    initialTestSessionState,
  )
  const accumulatedScores = calculateScores(
    state.selectedAnswers,
    questions,
  )

  return (
    <TestSessionContext value={{ state, accumulatedScores, dispatch }}>
      {children}
    </TestSessionContext>
  )
}
