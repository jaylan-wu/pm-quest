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
    <main className="page-shell landing-page">
      <section
        className="surface landing-surface"
        aria-labelledby="landing-title"
      >
        <h1 id="landing-title">Day in the Life of a Peer Mentor</h1>
        <p>
          Navigate ten moments in a peer mentor&apos;s day to discover your
          gamer class.
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
