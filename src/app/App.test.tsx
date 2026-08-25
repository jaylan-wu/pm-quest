import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TestSessionProvider } from '../features/personality-test/TestSessionProvider'
import { gamerClasses } from '../features/personality-test/data/gamerClasses'
import { questions } from '../features/personality-test/data/questions'
import { App, AppRoutes } from './App'

const RAW_SCORE_MAPPING =
  /\b(?:moba|fps|rpg|sports|sandbox|mobile|tabletop)\b["']?\s*(?:\+|:|=)?\s*[123]\b/i
const RAW_SCORE_VALUE = /\+\s*[123]\b/

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState(null, '', '/')
})

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

async function completeQuizWithFirstChoices(
  user: ReturnType<typeof userEvent.setup>,
): Promise<void> {
  await user.click(screen.getByRole('button', { name: 'Start the test' }))

  for (const [questionIndex] of questions.entries()) {
    await user.click(screen.getAllByRole('radio')[0])
    await user.click(
      screen.getByRole('button', {
        name:
          questionIndex === questions.length - 1
            ? 'See result'
            : 'Continue',
      }),
    )
  }
}

describe('personality test routes', () => {
  it('keeps navigation within the GitHub Pages path', async () => {
    const user = userEvent.setup()
    window.history.replaceState(null, '', '/pm-quest/#/')

    render(<App />)

    await user.click(
      screen.getByRole('button', { name: 'Start the test' }),
    )

    expect(window.location.pathname).toBe('/pm-quest/')
    expect(window.location.hash).toBe('#/adventure')
  })

  it('redirects an incomplete result visit to the landing page', async () => {
    renderAt('/result')

    expect(
      await screen.findByRole('heading', {
        name: 'Choose Your Character',
      }),
    ).toBeInTheDocument()
  })

  it('renders every canonical gamer type on a direct visit without marking a current type', () => {
    renderAt('/gamer-types')

    expect(
      screen.getByRole('heading', { name: 'All Gamer Types' }),
    ).toBeInTheDocument()

    const directory = screen.getByRole('region', { name: 'Gamer types' })
    expect(within(directory).getAllByRole('article')).toHaveLength(
      gamerClasses.length,
    )

    for (const gamerClass of gamerClasses) {
      expect(
        within(directory).getByRole('heading', {
          name: gamerClass.name,
        }),
      ).toBeInTheDocument()
      expect(
        within(directory).getByText(gamerClass.description),
      ).toBeInTheDocument()
    }

    expect(screen.queryByText(/^Your type$/i)).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Take the test' }),
    ).toBeInTheDocument()
    expectRawScoresToBeHidden()
  })

  it('opens the gamer-type directory from a result and starts a clean retake', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await completeQuizWithFirstChoices(user)

    const resultGamerClass = gamerClasses.find((gamerClass) =>
      screen.queryByRole('heading', { name: gamerClass.name }),
    )

    expect(resultGamerClass).toBeDefined()
    if (resultGamerClass === undefined) {
      throw new Error('Expected the completed quiz to render a gamer type')
    }

    await user.click(
      screen.getByRole('link', { name: 'View all gamer types' }),
    )

    expect(
      await screen.findByRole('heading', { name: 'All Gamer Types' }),
    ).toBeInTheDocument()

    const directory = screen.getByRole('region', { name: 'Gamer types' })
    expect(within(directory).getAllByRole('article')).toHaveLength(
      gamerClasses.length,
    )

    const currentTypeLabels = within(directory).getAllByText(
      /^Your type$/i,
    )
    expect(currentTypeLabels).toHaveLength(1)

    const currentTypeCard = currentTypeLabels[0]?.closest('article')
    expect(currentTypeCard).not.toBeNull()
    if (currentTypeCard === null) {
      throw new Error('Expected the current-type label to be inside a card')
    }

    expect(
      within(currentTypeCard).getByRole('heading', {
        name: resultGamerClass.name,
      }),
    ).toBeInTheDocument()
    expectRawScoresToBeHidden()

    await user.click(
      screen.getByRole('button', { name: 'Take the test again' }),
    )

    expect(
      await screen.findByRole('heading', { name: questions[0].title }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: 'Quiz progress' }),
    ).toHaveAttribute('value', '1')
    expect(
      screen.getByRole('progressbar', { name: 'Quiz progress' }),
    ).toHaveAttribute('max', String(questions.length))

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).not.toBeChecked()
    }

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('preloads only the next question image as the quiz advances', async () => {
    const preloadedSources: string[] = []

    class PreloadImageStub {
      set src(source: string) {
        preloadedSources.push(source)
      }
    }

    vi.stubGlobal('Image', PreloadImageStub)

    const user = userEvent.setup()
    renderAt('/')

    await user.click(
      screen.getByRole('button', { name: 'Start the test' }),
    )

    expect(preloadedSources).toEqual([])

    await user.click(screen.getAllByRole('radio')[0])

    expect(preloadedSources).toEqual([questions[1].image.src])

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(preloadedSources).toEqual([questions[1].image.src])

    for (
      let questionIndex = 1;
      questionIndex < questions.length;
      questionIndex += 1
    ) {
      await user.click(screen.getAllByRole('radio')[0])

      expect(preloadedSources).toEqual(
        questions
          .slice(1, Math.min(questionIndex + 2, questions.length))
          .map((question) => question.image.src),
      )

      await user.click(
        screen.getByRole('button', {
          name:
            questionIndex === questions.length - 1
              ? 'See result'
              : 'Continue',
        }),
      )
    }

    expect(preloadedSources).toEqual(
      questions.slice(1).map((question) => question.image.src),
    )
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
        screen.getByRole('progressbar', { name: 'Quiz progress' }),
      ).toHaveAttribute('value', String(questionNumber))
      expect(
        screen.getByRole('progressbar', { name: 'Quiz progress' }),
      ).toHaveAttribute('max', String(questions.length))
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

      const selectedRadio = screen.getAllByRole('radio')[0]
      expect(selectedRadio).not.toBeChecked()

      await user.click(selectedRadio)

      expect(selectedRadio).toBeChecked()
      expect(
        screen.getByRole('button', {
          name:
            questionNumber === questions.length
              ? 'See result'
              : 'Continue',
        }),
      ).toBeEnabled()
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
