import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QuestionImage } from './QuestionImage'

describe('QuestionImage', () => {
  it('reserves the image viewport and shows a placeholder without a source', () => {
    const { container } = render(<QuestionImage image={{ alt: '' }} />)

    expect(
      container.querySelector('.question-image__viewport'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('.question-image__placeholder'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByText(/^Scene \/ \d{2}$/i)).not.toBeInTheDocument()
  })

  it('shows a loaded image with authored alt text and crop positioning', () => {
    const { container } = render(
      <QuestionImage
        image={{
          src: '/assets/questions/question-01.webp',
          alt: 'An alarm clock beside a bed.',
          position: '50% 35%',
        }}
      />,
    )

    const image = screen.getByRole('img', {
      name: 'An alarm clock beside a bed.',
    })

    expect(image).toHaveStyle({ objectPosition: '50% 35%' })
    expect(
      container.querySelector('.question-image__placeholder'),
    ).toBeInTheDocument()

    fireEvent.load(image)

    expect(image).toHaveClass('question-image__media--loaded')
    expect(
      container.querySelector('.question-image__placeholder'),
    ).not.toBeInTheDocument()
  })

  it('replaces a broken image with the placeholder', () => {
    const { container } = render(
      <QuestionImage
        image={{
          src: '/assets/questions/missing.webp',
          alt: 'A campus scene.',
        }}
      />,
    )

    const image = screen.getByRole('img', { name: 'A campus scene.' })

    expect(image).toHaveStyle({ objectPosition: 'center' })
    fireEvent.error(image)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(
      container.querySelector('.question-image__placeholder'),
    ).toBeInTheDocument()
    expect(screen.getByText('Scene unavailable')).toBeInTheDocument()
  })

  it('tries a new source after the previous question image failed', () => {
    const { container, rerender } = render(
      <QuestionImage
        image={{ src: '/assets/questions/first.webp', alt: 'First scene.' }}
      />,
    )

    fireEvent.error(screen.getByRole('img', { name: 'First scene.' }))

    rerender(
      <QuestionImage
        image={{ src: '/assets/questions/second.webp', alt: 'Second scene.' }}
      />,
    )

    const nextImage = screen.getByRole('img', { name: 'Second scene.' })

    expect(nextImage).toHaveAttribute(
      'src',
      '/assets/questions/second.webp',
    )
    expect(
      container.querySelector('.question-image__placeholder'),
    ).toBeInTheDocument()

    fireEvent.load(nextImage)

    expect(
      container.querySelector('.question-image__placeholder'),
    ).not.toBeInTheDocument()
  })
})
