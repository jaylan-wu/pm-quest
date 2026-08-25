import type { ReactElement } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useTestSession } from '../features/personality-test/useTestSession'

const gamerStatLabels = [
  ['teamwork', 'Teamwork'],
  ['strategy', 'Strategy'],
  ['creativity', 'Creativity'],
  ['competitiveness', 'Competitiveness'],
  ['adaptability', 'Adaptability'],
] as const

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
        <dl className="character-stats">
          {gamerStatLabels.map(([stat, label]) => (
            <div key={stat}>
              <dt>{label}</dt>
              <dd>{gamerClass.stats[stat]} / 10</dd>
              <dd className="character-stat-visual" aria-hidden="true">
                <progress
                  className="character-stat-meter"
                  value={gamerClass.stats[stat]}
                  max={10}
                />
              </dd>
            </div>
          ))}
        </dl>

        <div className="actions">
          <button className="button" type="button" onClick={handleRestart}>
            Take the test again
          </button>
        </div>
      </article>
    </main>
  )
}
