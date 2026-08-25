import { describe, expect, it } from 'vitest'

import { calculateResult } from '../scoring'
import { GAMER_CLASS_IDS, type SelectedAnswer } from '../types'
import { gamerClasses } from './gamerClasses'
import { questions } from './questions'

const EXPECTED_QUESTION_TITLES = [
  'You wake up to start your day… how do you wake up?',
  "It's time for breakfast. What are you having?",
  "It's time to commute to campus. How are you getting there?",
  "You've arrived at your first class of the day. What are you doing?",
  'Time for your Open Lab shift. What are you doing?',
  "Class and shifts are over. Now you have to study for an exam. What's your strategy?",
  'Club sign-ups are next week! What are you planning to do?',
  "Ingrid Slack messaged you to meet her in her office. What's it for?",
  'You were planning to do laundry tonight, but your friends asked you to hang out. What do you do?',
  "It's finally time for bed. What's your nighttime routine?",
] as const

const EXPECTED_CHOICE_COUNTS = [4, 5, 4, 4, 5, 4, 4, 4, 4, 4] as const

const EXPECTED_IMAGE_METADATA = [
  {
    filename: 'question-01.webp',
    alt: 'A person hides under pillows beside a bedside alarm clock.',
    position: '50% 45%',
  },
  {
    filename: 'question-02.webp',
    alt: 'A breakfast plate and coffee sit beside a newspaper.',
    position: undefined,
  },
  {
    filename: 'question-03.webp',
    alt: 'Commuters wait on a subway platform as a train passes.',
    position: undefined,
  },
  {
    filename: 'question-04.webp',
    alt: 'Rows of seats in an empty college lecture hall.',
    position: undefined,
  },
  {
    filename: 'question-05.webp',
    alt: 'Hands connect wires inside a small electronics project.',
    position: undefined,
  },
  {
    filename: 'question-06.webp',
    alt: 'A student studies an open textbook at a desk.',
    position: '50% 55%',
  },
  {
    filename: 'question-07.webp',
    alt: 'People browse stacks of books in a bookstore.',
    position: undefined,
  },
  {
    filename: 'question-08.webp',
    alt: 'An empty office desk holds a laptop, lamp, and pencils.',
    position: '50% 70%',
  },
  {
    filename: 'question-09.webp',
    alt: 'Two people wait beside washing machines and a cart of laundry.',
    position: '50% 55%',
  },
  {
    filename: 'question-10.webp',
    alt: 'A person wearing a sleep mask rests in bed.',
    position: undefined,
  },
] as const

describe('Day in the Life of a Peer Mentor question data', () => {
  it('contains the ten questions in their intended order', () => {
    expect(questions.map((question) => question.id)).toEqual(
      Array.from({ length: 10 }, (_, index) => `q${index + 1}`),
    )
    expect(questions.map((question) => question.title)).toEqual(
      EXPECTED_QUESTION_TITLES,
    )
  })

  it('contains 42 choices with the expected count for each question', () => {
    expect(questions.map((question) => question.choices.length)).toEqual(
      EXPECTED_CHOICE_COUNTS,
    )
    expect(
      questions.reduce(
        (choiceCount, question) => choiceCount + question.choices.length,
        0,
      ),
    ).toBe(42)
  })

  it('maps every question to its ordered WebP asset and authored alt text', () => {
    const imageSources = questions.map((question) => question.image.src)

    expect(
      questions.map((question) => ({
        src: question.image.src,
        alt: question.image.alt,
        position:
          'position' in question.image
            ? question.image.position
            : undefined,
      })),
    ).toEqual(
      EXPECTED_IMAGE_METADATA.map(({ filename, alt, position }) => ({
        src: `${import.meta.env.BASE_URL}assets/questions/${filename}`,
        alt,
        position,
      })),
    )
    expect(new Set(imageSources).size).toBe(questions.length)

    for (const question of questions) {
      expect(question.image.src.trim()).not.toBe('')
      expect(question.image.alt.trim()).not.toBe('')
    }
  })

  it('uses globally unique question and choice IDs', () => {
    const questionIds = questions.map((question) => question.id)
    const choiceIds = questions.flatMap((question) =>
      question.choices.map((choice) => choice.id),
    )

    expect(new Set(questionIds).size).toBe(questionIds.length)
    expect(new Set(choiceIds).size).toBe(choiceIds.length)
  })

  it('gives every choice a nonempty provisional +1 mapping with valid class IDs', () => {
    const validGamerClassIds = new Set<string>(GAMER_CLASS_IDS)

    for (const question of questions) {
      for (const choice of question.choices) {
        const scoreEntries = Object.entries(choice.scores)

        expect(scoreEntries.length).toBeGreaterThan(0)

        for (const [gamerClassId, score] of scoreEntries) {
          expect(validGamerClassIds.has(gamerClassId)).toBe(true)
          expect(score).toBe(1)
        }
      }
    }
  })

  it('maps Question 9 Choice 1 only to tabletop', () => {
    const questionNine = questions.find((question) => question.id === 'q9')

    expect(questionNine?.choices[0]).toMatchObject({
      id: 'q9-do-laundry',
      scores: { tabletop: 1 },
    })
    expect(Object.keys(questionNine?.choices[0].scores ?? {})).toEqual([
      'tabletop',
    ])
  })

  it('preserves both intentional FPS associations in Question 8', () => {
    const questionEight = questions.find((question) => question.id === 'q8')

    expect(
      questionEight?.choices
        .filter((choice) =>
          Object.entries(choice.scores).some(
            ([gamerClassId, score]) =>
              gamerClassId === 'fps' && score === 1,
          ),
        )
        .map((choice) => choice.id),
    ).toEqual(['q8-lan-party', 'q8-professor-offices'])
  })

  it('produces the same result for the same complete answer set', () => {
    const answers: readonly SelectedAnswer[] = questions.map((question) => ({
      questionId: question.id,
      choiceId: question.choices[0].id,
    }))

    const firstResult = calculateResult(answers, questions, gamerClasses)
    const repeatedResult = calculateResult(answers, questions, gamerClasses)

    expect(repeatedResult).toEqual(firstResult)
    expect(firstResult.gamerClass.id).toBe('moba')
  })
})
