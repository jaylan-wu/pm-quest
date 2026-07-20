import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { TestSessionProvider } from '../features/personality-test/TestSessionProvider'
import { AppRoutes } from './App'

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

    await user.click(
      screen.getByRole('button', { name: 'Start the test' }),
    )

    for (let questionNumber = 1; questionNumber <= 8; questionNumber += 1) {
      expect(
        screen.getByText(`Question ${questionNumber} of 8`),
      ).toBeInTheDocument()

      await user.click(screen.getAllByRole('radio')[0])
      await user.click(
        screen.getByRole('button', {
          name: questionNumber === 8 ? 'See result' : 'Continue',
        }),
      )
    }

    expect(await screen.findByText('Your character')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Take the test again' }),
    ).toBeInTheDocument()
  })
})
