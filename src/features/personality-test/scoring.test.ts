import { describe, expect, it } from 'vitest'

import { characterTieBreakOrder, characters } from './data/characters'
import { questions } from './data/questions'
import { scoringConfig } from './data/scoringConfig'
import { calculateResult, calculateScores } from './scoring'
import type { CharacterResult, Question, ScoringConfig, SelectedAnswer } from './types'

describe('placeholder personality-test data', () => {
  it('contains exactly eight questions and three character results', () => {
    expect(questions).toHaveLength(8)
    expect(characters).toHaveLength(3)
  })

  it('uses stable unique IDs', () => {
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length)
    expect(new Set(characters.map((character) => character.id)).size).toBe(characters.length)

    for (const question of questions) {
      expect(new Set(question.choices.map((choice) => choice.id)).size).toBe(
        question.choices.length,
      )
    }
  })
})

describe('calculateScores', () => {
  it('accumulates trait effects and applies primary and secondary weights', () => {
    const answers: readonly SelectedAnswer[] = [
      { questionId: 'session-opening', choiceId: 'session-opening-check-in' },
      { questionId: 'unclear-direction', choiceId: 'unclear-direction-break-down' },
      { questionId: 'quiet-group', choiceId: 'quiet-group-format' },
    ]

    expect(calculateScores(answers, questions, characters)).toEqual({
      traitScores: {
        collaboration: 2,
        structure: 2,
        adaptability: 2,
      },
      characterScores: {
        guide: 6,
        planner: 6,
        adapter: 6,
      },
    })
  })

  it('includes optional direct character effects', () => {
    const directQuestion: Question = {
      id: 'direct-effect',
      title: 'Direct effect',
      scenario: 'Choose an option.',
      choices: [
        {
          id: 'direct-effect-guide',
          text: 'Choose this option.',
          traitEffects: {},
          characterEffects: { guide: 3 },
        },
      ],
    }

    const scores = calculateScores(
      [{ questionId: directQuestion.id, choiceId: directQuestion.choices[0].id }],
      [directQuestion],
      characters,
    )

    expect(scores.characterScores).toEqual({ guide: 3, planner: 0, adapter: 0 })
  })

  it('rejects an answer whose choice does not belong to its question', () => {
    expect(() =>
      calculateScores(
        [{ questionId: 'session-opening', choiceId: 'quiet-group-pairs' }],
        questions,
        characters,
      ),
    ).toThrow('Unknown choice ID quiet-group-pairs for question session-opening')
  })
})

describe('calculateResult', () => {
  it('returns the highest-scoring character and score details', () => {
    const collaborationAnswers: readonly SelectedAnswer[] = questions.map((question) => ({
      questionId: question.id,
      choiceId: question.choices[0].id,
    }))

    const result = calculateResult(collaborationAnswers, questions, characters)

    expect(result.character.id).toBe('guide')
    expect(result.winningScore).toBe(32)
    expect(result.traitScores.collaboration).toBe(16)
  })

  it('resolves equal scores by declared priority, independent of character array order', () => {
    const reversedCharacters = [...characters].reverse()

    const firstResult = calculateResult([], questions, characters)
    const secondResult = calculateResult([], questions, reversedCharacters)

    expect(characterTieBreakOrder[0]).toBe('guide')
    expect(firstResult.character.id).toBe('guide')
    expect(secondResult.character.id).toBe('guide')
  })

  it('honors a different explicit tie-break configuration', () => {
    const alternateConfig: ScoringConfig = {
      ...scoringConfig,
      characterTieBreakOrder: ['adapter', 'planner', 'guide'],
    }

    expect(calculateResult([], questions, characters, alternateConfig).character.id).toBe(
      'adapter',
    )
  })

  it('rejects an incomplete tie-break configuration', () => {
    const invalidConfig: ScoringConfig = {
      ...scoringConfig,
      characterTieBreakOrder: ['guide', 'planner'],
    }

    expect(() => calculateResult([], questions, characters, invalidConfig)).toThrow(
      'Tie-break order must contain every character ID exactly once',
    )
  })

  it('works with any valid character ordering and explicit priority', () => {
    const minimalCharacters: readonly CharacterResult[] = [characters[2], characters[0], characters[1]]

    expect(calculateResult([], questions, minimalCharacters).character.id).toBe('guide')
  })
})
