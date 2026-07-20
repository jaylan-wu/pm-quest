import { useContext } from 'react'

import {
  TestSessionContext,
  type TestSessionContextValue,
} from './sessionContext'

export function useTestSession(): TestSessionContextValue {
  const session = useContext(TestSessionContext)

  if (session === null) {
    throw new Error('useTestSession must be used within TestSessionProvider')
  }

  return session
}
