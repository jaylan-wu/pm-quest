import type { ReactElement } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useTestSession } from '../features/personality-test/useTestSession'

export function ResultPage(): ReactElement {
  const { state, dispatch } = useTestSession()
  const navigate = useNavigate()

  if (!state.isComplete || state.result === null) {
    return <Navigate to="/" replace />
  }

  const { character } = state.result

  function handleRestart(): void {
    dispatch({ type: 'RESET_TEST' })
    navigate('/')
  }

  return (
    <main className="page-shell">
      <article className="surface" aria-labelledby="result-title">
        <p className="muted">Your character</p>
        <h1 id="result-title">{character.name}</h1>
        <h2>{character.title}</h2>
        <p>{character.description}</p>

        <h2>Strengths</h2>
        <ul>
          {character.strengths.map((strength) => (
            <li key={strength}>{strength}</li>
          ))}
        </ul>

        <h2>Growth area</h2>
        <p>{character.growthArea}</p>

        <div className="actions">
          <button className="button" type="button" onClick={handleRestart}>
            Take the test again
          </button>
        </div>
      </article>
    </main>
  )
}
