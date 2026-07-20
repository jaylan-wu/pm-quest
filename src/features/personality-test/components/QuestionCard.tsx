import type { FormEvent, ReactElement } from 'react'

import type { Question } from '../types'

export interface QuestionCardProps {
  readonly question: Question
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
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onContinue()
  }

  const isFinalQuestion = questionNumber === questionCount

  return (
    <section className="surface" aria-labelledby="question-title">
      <p className="muted">
        Question {questionNumber} of {questionCount}
      </p>
      <h1 id="question-title">{question.title}</h1>
      <p>{question.scenario}</p>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Choose one response</legend>
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
