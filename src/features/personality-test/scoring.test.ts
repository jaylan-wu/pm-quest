import { describe, expect, it } from 'vitest'

import { gamerClasses } from './data/gamerClasses'
import { questions } from './data/questions'
import { GAMER_CLASS_TIE_PRIORITY } from './data/scoringConfig'
import { calculateResult, calculateScores } from './scoring'
import type {
  GamerClass,
  QuizQuestion,
  SelectedAnswer,
} from './types'

const EXPECTED_GAMER_CLASS_NAMES = {
  moba: 'MOBA Gamer',
  fps: 'FPS Gamer',
  rpg: 'RPG Gamer',
  sports: 'Sports Gamer',
  sandbox: 'Sandbox Gamer',
  mobile: 'Mobile Gamer',
  tabletop: 'Tabletop Gamer',
} as const

const EXPECTED_GAMER_CLASS_IDS = Object.keys(EXPECTED_GAMER_CLASS_NAMES)

const ZERO_CLASS_COUNTS = {
  moba: 0,
  fps: 0,
  rpg: 0,
  sports: 0,
  sandbox: 0,
  mobile: 0,
  tabletop: 0,
} as const

function createQuestion(
  id: string,
  scores: QuizQuestion['choices'][number]['scores'],
): QuizQuestion {
  return {
    id,
    title: `Question ${id}`,
    choices: [
      {
        id: `${id}-choice`,
        text: `Answer ${id}`,
        scores,
      },
    ],
  }
}

function selectEveryQuestion(
  questionsToAnswer: readonly QuizQuestion[],
): readonly SelectedAnswer[] {
  return questionsToAnswer.map((question) => ({
    questionId: question.id,
    choiceId: question.choices[0].id,
  }))
}

describe('personality-test data', () => {
  it('contains exactly ten questions and the seven named gamer classes', () => {
    expect(questions).toHaveLength(10)
    expect(gamerClasses).toHaveLength(7)
    expect(
      Object.fromEntries(
        gamerClasses.map((gamerClass) => [gamerClass.id, gamerClass.name]),
      ),
    ).toEqual(EXPECTED_GAMER_CLASS_NAMES)
    expect(GAMER_CLASS_TIE_PRIORITY).toEqual(EXPECTED_GAMER_CLASS_IDS)
  })

  it('uses stable unique question, choice, and gamer-class IDs', () => {
    const questionIds = questions.map((question) => question.id)
    const choiceIds = questions.flatMap((question) =>
      question.choices.map((choice) => choice.id),
    )
    const gamerClassIds = gamerClasses.map((gamerClass) => gamerClass.id)

    expect(new Set(questionIds).size).toBe(questionIds.length)
    expect(new Set(choiceIds).size).toBe(choiceIds.length)
    expect(new Set(gamerClassIds).size).toBe(gamerClassIds.length)
    expect(new Set(gamerClassIds)).toEqual(new Set(EXPECTED_GAMER_CLASS_IDS))
  })

  it('uses only valid gamer-class IDs and weights from one through three', () => {
    for (const question of questions) {
      for (const choice of question.choices) {
        for (const [gamerClassId, weight] of Object.entries(choice.scores)) {
          expect(EXPECTED_GAMER_CLASS_IDS).toContain(gamerClassId)
          expect(Number.isInteger(weight)).toBe(true)
          expect(weight).toBeGreaterThanOrEqual(1)
          expect(weight).toBeLessThanOrEqual(3)
        }
      }
    }
  })

  it('defines all five presentation stats as integers from one through ten', () => {
    const expectedStatNames = [
      'adaptability',
      'competitiveness',
      'creativity',
      'strategy',
      'teamwork',
    ]

    for (const gamerClass of gamerClasses) {
      expect(Object.keys(gamerClass.stats).sort()).toEqual(expectedStatNames)

      for (const stat of Object.values(gamerClass.stats)) {
        expect(Number.isInteger(stat)).toBe(true)
        expect(stat).toBeGreaterThanOrEqual(1)
        expect(stat).toBeLessThanOrEqual(10)
      }
    }
  })
})

describe('calculateScores', () => {
  it('awards points directly to one class and initializes omitted classes to zero', () => {
    const scoringQuestions = [createQuestion('single', { moba: 2 })]

    expect(
      calculateScores(selectEveryQuestion(scoringQuestions), scoringQuestions),
    ).toEqual({
      classScores: { ...ZERO_CLASS_COUNTS, moba: 2 },
      strongAssociationCounts: ZERO_CLASS_COUNTS,
      contributingQuestionCounts: { ...ZERO_CLASS_COUNTS, moba: 1 },
    })
  })

  it('accumulates one answer into multiple classes across questions', () => {
    const scoringQuestions = [
      createQuestion('first', { sports: 2, mobile: 1 }),
      createQuestion('second', { sports: 1, mobile: 3 }),
    ]

    expect(
      calculateScores(selectEveryQuestion(scoringQuestions), scoringQuestions),
    ).toEqual({
      classScores: {
        ...ZERO_CLASS_COUNTS,
        sports: 3,
        mobile: 4,
      },
      strongAssociationCounts: {
        ...ZERO_CLASS_COUNTS,
        mobile: 1,
      },
      contributingQuestionCounts: {
        ...ZERO_CLASS_COUNTS,
        sports: 2,
        mobile: 2,
      },
    })
  })

  it('rejects an unknown question', () => {
    const scoringQuestions = [createQuestion('known', { moba: 2 })]

    expect(() =>
      calculateScores(
        [{ questionId: 'unknown', choiceId: 'unknown-choice' }],
        scoringQuestions,
      ),
    ).toThrow(/Unknown question ID/)
  })

  it('rejects a choice that does not belong to its question', () => {
    const scoringQuestions = [
      createQuestion('first', { moba: 2 }),
      createQuestion('second', { fps: 2 }),
    ]

    expect(() =>
      calculateScores(
        [{ questionId: 'first', choiceId: 'second-choice' }],
        scoringQuestions,
      ),
    ).toThrow(/Unknown choice ID/)
  })

  it('rejects multiple selected answers for the same question', () => {
    const scoringQuestions = [createQuestion('duplicate', { moba: 2 })]
    const duplicateAnswer = {
      questionId: 'duplicate',
      choiceId: 'duplicate-choice',
    }

    expect(() =>
      calculateScores(
        [duplicateAnswer, duplicateAnswer],
        scoringQuestions,
      ),
    ).toThrow(/answered more than once/i)
  })
})

describe('calculateResult', () => {
  it('returns the class with the highest accumulated score', () => {
    const scoringQuestions = [
      createQuestion('highest-score', { moba: 2, tabletop: 3 }),
    ]

    const result = calculateResult(
      selectEveryQuestion(scoringQuestions),
      scoringQuestions,
      gamerClasses,
    )

    expect(result.gamerClass.id).toBe('tabletop')
    expect(result.winningScore).toBe(3)
    expect(result.classScores.tabletop).toBe(3)
  })

  it('breaks a total-score tie by the number of +3 contributions', () => {
    const scoringQuestions = [
      createQuestion('strong', { moba: 1, fps: 3 }),
      createQuestion('moba-second', { moba: 1 }),
      createQuestion('moba-third', { moba: 1 }),
    ]

    const result = calculateResult(
      selectEveryQuestion(scoringQuestions),
      scoringQuestions,
      gamerClasses,
    )

    expect(result.classScores.moba).toBe(3)
    expect(result.classScores.fps).toBe(3)
    expect(result.strongAssociationCounts.moba).toBe(0)
    expect(result.strongAssociationCounts.fps).toBe(1)
    expect(result.contributingQuestionCounts.moba).toBe(3)
    expect(result.contributingQuestionCounts.fps).toBe(1)
    expect(result.gamerClass.id).toBe('fps')
  })

  it('breaks a remaining tie by the number of contributing questions', () => {
    const scoringQuestions = [
      createQuestion('shared', { moba: 2, fps: 1 }),
      createQuestion('fps-second', { fps: 1 }),
    ]

    const result = calculateResult(
      selectEveryQuestion(scoringQuestions),
      scoringQuestions,
      gamerClasses,
    )

    expect(result.classScores.moba).toBe(2)
    expect(result.classScores.fps).toBe(2)
    expect(result.strongAssociationCounts.moba).toBe(0)
    expect(result.strongAssociationCounts.fps).toBe(0)
    expect(result.contributingQuestionCounts.moba).toBe(1)
    expect(result.contributingQuestionCounts.fps).toBe(2)
    expect(result.gamerClass.id).toBe('fps')
  })

  it('uses fixed priority after all score metrics tie, independent of insertion order', () => {
    const scoringQuestions = [
      createQuestion('fixed-priority', { fps: 2, moba: 2 }),
    ]
    const reversedGamerClasses = [...gamerClasses].reverse()

    const result = calculateResult(
      selectEveryQuestion(scoringQuestions),
      scoringQuestions,
      reversedGamerClasses,
    )

    expect(GAMER_CLASS_TIE_PRIORITY[0]).toBe('moba')
    expect(result.gamerClass.id).toBe('moba')
  })

  it('does not use gamer-class presentation stats to choose a winner', () => {
    const scoringQuestions = [
      createQuestion('stats-independent', { rpg: 1, sandbox: 2 }),
    ]
    const alternateGamerClasses: readonly GamerClass[] = gamerClasses.map(
      (gamerClass) => ({
        ...gamerClass,
        stats: {
          teamwork: 1,
          strategy: 1,
          creativity: 1,
          competitiveness: 1,
          adaptability: 1,
        },
      }),
    )

    const originalResult = calculateResult(
      selectEveryQuestion(scoringQuestions),
      scoringQuestions,
      gamerClasses,
    )
    const alternateResult = calculateResult(
      selectEveryQuestion(scoringQuestions),
      scoringQuestions,
      alternateGamerClasses,
    )

    expect(originalResult.gamerClass.id).toBe('sandbox')
    expect(alternateResult.gamerClass.id).toBe(originalResult.gamerClass.id)
    expect(alternateResult.gamerClass.stats).toEqual({
      teamwork: 1,
      strategy: 1,
      creativity: 1,
      competitiveness: 1,
      adaptability: 1,
    })
  })
})
