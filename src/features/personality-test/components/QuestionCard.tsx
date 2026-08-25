import {
  useEffect,
  useRef,
  type FormEvent,
  type ReactElement,
} from 'react'

import type { QuizQuestion } from '../types'
import { QuestionImage } from './QuestionImage'

export interface QuestionCardProps {
  readonly question: QuizQuestion
  readonly questionNumber: number
  readonly questionCount: number
  readonly selectedChoiceId?: string
  readonly onSelectChoice: (choiceId: string) => void
  readonly onContinue: () => void
}

export function QuestionCard({
  question,
  questionNumber,
  questionCount,
  selectedChoiceId,
  onSelectChoice,
  onContinue,
}: QuestionCardProps): ReactElement {
  const questionTitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    questionTitleRef.current?.focus()
  }, [question.id])

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onContinue()
  }

  const isFinalQuestion = questionNumber === questionCount
  const formattedQuestionNumber = String(questionNumber).padStart(2, '0')
  const formattedQuestionCount = String(questionCount).padStart(2, '0')

  return (
    <section
      className="surface question-card"
      aria-labelledby="question-title"
    >
      <header className="quiz-header">
        <span className="quiz-brand ui-label">Choose your character</span>
      </header>

      <div className="quiz-progress-block">
        <div className="quiz-progress-meta">
          <span className="muted ui-label">Quiz progress</span>
          <span className="quiz-progress-count ui-label">
            {formattedQuestionNumber} / {formattedQuestionCount}
          </span>
        </div>
        <progress
          className="quiz-progress"
          value={questionNumber}
          max={questionCount}
          aria-label="Quiz progress"
          aria-valuetext={`Question ${questionNumber} of ${questionCount}`}
        >
          {questionNumber} of {questionCount}
        </progress>
      </div>

      <QuestionImage
        image={question.image}
        questionNumber={questionNumber}
      />

      <div className="question-prompt">
        <p className="muted ui-label">
          Question {questionNumber} of {questionCount}
        </p>
        <h1 id="question-title" ref={questionTitleRef} tabIndex={-1}>
          {question.title}
        </h1>
        {question.scenario === undefined ? null : <p>{question.scenario}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend className="ui-label">Choose one response</legend>
          {question.choices.map((choice) => (
            <label className="choice" key={choice.id}>
              <input
                type="radio"
                name={question.id}
                value={choice.id}
                checked={selectedChoiceId === choice.id}
                onChange={() => onSelectChoice(choice.id)}
              />
              <span>{choice.text}</span>
            </label>
          ))}
        </fieldset>

        <div className="actions">
          <button
            className="button"
            type="submit"
            disabled={selectedChoiceId === undefined}
          >
            {isFinalQuestion ? 'See result' : 'Continue'}
          </button>
        </div>
      </form>
    </section>
  )
}
