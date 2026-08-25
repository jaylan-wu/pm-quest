import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { TestSessionProvider } from '../features/personality-test/TestSessionProvider'
import { gamerClasses } from '../features/personality-test/data/gamerClasses'
import { questions } from '../features/personality-test/data/questions'
import { AppRoutes } from './App'

const RAW_SCORE_MAPPING =
  /\b(?:moba|fps|rpg|sports|sandbox|mobile|tabletop)\b["']?\s*(?:\+|:|=)?\s*[123]\b/i
const RAW_SCORE_VALUE = /\+\s*[123]\b/

function expectRawScoresToBeHidden(): void {
  expect(document.body).not.toHaveTextContent(RAW_SCORE_MAPPING)
  expect(document.body).not.toHaveTextContent(RAW_SCORE_VALUE)
  expect(document.body).not.toHaveTextContent(
    /\b(?:winning|class|total) score\s*(?::|=)?\s*\d/i,
  )
}

function renderAt(path: string): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <TestSessionProvider>
        <AppRoutes />
      </TestSessionProvider>
    </MemoryRouter>,
  )
}

describe('personality test routes', () => {
  it('redirects an incomplete result visit to the landing page', async () => {
    renderAt('/result')

    expect(
      await screen.findByRole('heading', {
        name: 'Choose Your Character',
      }),
    ).toBeInTheDocument()
  })

  it('supports the complete landing-to-result flow', async () => {
    const user = userEvent.setup()
    renderAt('/')

    expect(questions).toHaveLength(10)

    await user.click(
      screen.getByRole('button', { name: 'Start the test' }),
    )

    for (const [questionIndex, question] of questions.entries()) {
      const questionNumber = questionIndex + 1

      expect(
        screen.getByText(`Question ${questionNumber} of ${questions.length}`),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: question.title }),
      ).toBeInTheDocument()
      expect(screen.getAllByRole('radio')).toHaveLength(
        question.choices.length,
      )

      for (const choice of question.choices) {
        expect(
          screen.getByRole('radio', { name: choice.text }),
        ).toBeInTheDocument()
      }

      expectRawScoresToBeHidden()

      await user.click(screen.getAllByRole('radio')[0])
      expectRawScoresToBeHidden()
      await user.click(
        screen.getByRole('button', {
          name:
            questionNumber === questions.length
              ? 'See result'
              : 'Continue',
        }),
      )
    }

    const restartButton = await screen.findByRole('button', {
      name: 'Take the test again',
    })
    const displayedGamerClasses = gamerClasses.filter((gamerClass) =>
      screen.queryByRole('heading', { name: gamerClass.name }),
    )

    expect(displayedGamerClasses).toHaveLength(1)
    expectRawScoresToBeHidden()
    expect(
      screen.getByRole('heading', { name: 'Character stats' }),
    ).toBeInTheDocument()

    for (const statLabel of [
      'Teamwork',
      'Strategy',
      'Creativity',
      'Competitiveness',
      'Adaptability',
    ]) {
      expect(screen.getByText(statLabel)).toBeInTheDocument()
    }

    await user.click(restartButton)

    expect(
      await screen.findByRole('heading', { name: 'Choose Your Character' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start the test' }))

    expect(
      await screen.findByText(`Question 1 of ${questions.length}`),
    ).toBeInTheDocument()
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).not.toBeChecked()
    }

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })
})
