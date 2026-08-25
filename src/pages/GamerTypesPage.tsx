import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { GamerTypeCard } from '../features/personality-test/components/GamerTypeCard'
import { gamerClasses } from '../features/personality-test/data/gamerClasses'
import { useTestSession } from '../features/personality-test/useTestSession'

export function GamerTypesPage(): ReactElement {
  const { state, dispatch } = useTestSession()
  const navigate = useNavigate()
  const hasCompletedTest = state.isComplete && state.result !== null
  const currentGamerClassId = hasCompletedTest
    ? state.result.gamerClass.id
    : undefined

  function handleTakeQuiz(): void {
    dispatch({ type: 'START_TEST' })
    navigate('/adventure')
  }

  return (
    <main className="page-shell gamer-types-page">
      <div className="gamer-types-directory">
        <header className="surface gamer-types-header">
          <p className="muted ui-label">Gamer type directory</p>
          <h1>All Gamer Types</h1>
          <p>Browse every gamer type available in the test.</p>
          <div className="actions">
            <button className="button" type="button" onClick={handleTakeQuiz}>
              {hasCompletedTest ? 'Take the test again' : 'Take the test'}
            </button>
          </div>
        </header>

        <section className="gamer-types-grid" aria-label="Gamer types">
          {gamerClasses.map((gamerClass) => (
            <GamerTypeCard
              gamerClass={gamerClass}
              isCurrent={gamerClass.id === currentGamerClassId}
              key={gamerClass.id}
            />
          ))}
        </section>
      </div>
    </main>
  )
}
