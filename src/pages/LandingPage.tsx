import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { useTestSession } from '../features/personality-test/useTestSession'

export function LandingPage(): ReactElement {
  const { dispatch } = useTestSession()
  const navigate = useNavigate()

  function handleStart(): void {
    dispatch({ type: 'START_TEST' })
    navigate('/adventure')
  }

  return (
    <main className="page-shell">
      <section className="surface" aria-labelledby="landing-title">
        <h1 id="landing-title">Choose Your Character</h1>
        <p>
          Make eight choices to receive a placeholder character result.
        </p>
        <div className="actions">
          <button className="button" type="button" onClick={handleStart}>
            Start the test
          </button>
        </div>
      </section>
    </main>
  )
}
