import type { ReactElement } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { QuestionCard } from '../features/personality-test/components/QuestionCard'
import { questions } from '../features/personality-test/data/questions'
import { useTestSession } from '../features/personality-test/useTestSession'

export function AdventurePage(): ReactElement {
  const { state, dispatch } = useTestSession()
  const navigate = useNavigate()

  if (!state.isStarted) {
    return <Navigate to="/" replace />
  }

  if (state.isComplete) {
    return <Navigate to="/result" replace />
  }

  const question = questions[state.currentQuestionIndex]

  if (question === undefined) {
    return <Navigate to="/" replace />
  }

  const selectedChoiceId = state.selectedAnswers.find(
    (answer) => answer.questionId === question.id,
  )?.choiceId

  function handleContinue(): void {
    const isFinalQuestion =
      state.currentQuestionIndex === questions.length - 1

    if (isFinalQuestion) {
      dispatch({ type: 'COMPLETE_TEST' })
      navigate('/result')
      return
    }

    dispatch({ type: 'ADVANCE_QUESTION' })
  }

  return (
    <main className="page-shell">
      <QuestionCard
        question={question}
        questionNumber={state.currentQuestionIndex + 1}
        questionCount={questions.length}
        selectedChoiceId={selectedChoiceId}
        onSelectChoice={(choiceId) =>
          dispatch({ type: 'ANSWER_QUESTION', choiceId })
        }
        onContinue={handleContinue}
      />
    </main>
  )
}
