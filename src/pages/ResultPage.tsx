import type { ReactElement } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { GamerStatsList } from '../features/personality-test/components/GamerStatsList'
import { useTestSession } from '../features/personality-test/useTestSession'

export function ResultPage(): ReactElement {
  const { state, dispatch } = useTestSession()
  const navigate = useNavigate()

  if (!state.isComplete || state.result === null) {
    return <Navigate to="/" replace />
  }

  const { gamerClass } = state.result

  function handleRestart(): void {
    dispatch({ type: 'RESET_TEST' })
    navigate('/')
  }

  return (
    <main className="page-shell result-page">
      <article
        className="surface result-surface"
        aria-labelledby="result-title"
      >
        <p className="muted ui-label">Your gamer class</p>
        <h1 className="result-class-name" id="result-title">
          {gamerClass.name}
        </h1>
        <p>{gamerClass.description}</p>

        <h2 className="result-section-heading ui-label">Character stats</h2>
        <GamerStatsList stats={gamerClass.stats} />

        <div className="actions result-actions">
          <button className="button" type="button" onClick={handleRestart}>
            Take the test again
          </button>
          <Link className="button button-secondary" to="/gamer-types">
            View all gamer types
          </Link>
        </div>
      </article>
    </main>
  )
}
