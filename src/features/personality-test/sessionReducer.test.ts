import { describe, expect, it } from 'vitest'

import { gamerClasses } from './data/gamerClasses'
import { questions } from './data/questions'
import {
  initialTestSessionState,
  testSessionReducer,
  type TestSessionState,
} from './sessionReducer'

function startTest(): TestSessionState {
  return testSessionReducer(initialTestSessionState, { type: 'START_TEST' })
}

function completeTest(): TestSessionState {
  let state = startTest()

  questions.forEach((question, index) => {
    state = testSessionReducer(state, {
      type: 'ANSWER_QUESTION',
      choiceId: question.choices[0].id,
    })

    if (index < questions.length - 1) {
      state = testSessionReducer(state, { type: 'ADVANCE_QUESTION' })
    }
  })

  return testSessionReducer(state, { type: 'COMPLETE_TEST' })
}

describe('testSessionReducer', () => {
  it('starts a new test', () => {
    const state = startTest()

    expect(state).toEqual({
      ...initialTestSessionState,
      isStarted: true,
    })
  })

  it('selects an answer for the current question', () => {
    const choiceId = questions[0].choices[0].id
    const state = testSessionReducer(startTest(), {
      type: 'ANSWER_QUESTION',
      choiceId,
    })

    expect(state.selectedAnswers).toEqual([
      { questionId: questions[0].id, choiceId },
    ])
  })

  it('replaces the current selection without adding a duplicate', () => {
    const firstChoiceId = questions[0].choices[0].id
    const replacementChoiceId = questions[0].choices[1].id
    const firstSelection = testSessionReducer(startTest(), {
      type: 'ANSWER_QUESTION',
      choiceId: firstChoiceId,
    })
    const replacement = testSessionReducer(firstSelection, {
      type: 'ANSWER_QUESTION',
      choiceId: replacementChoiceId,
    })

    expect(replacement.selectedAnswers).toEqual([
      { questionId: questions[0].id, choiceId: replacementChoiceId },
    ])
  })

  it('advances after the current question is answered', () => {
    const answeredState = testSessionReducer(startTest(), {
      type: 'ANSWER_QUESTION',
      choiceId: questions[0].choices[0].id,
    })
    const state = testSessionReducer(answeredState, {
      type: 'ADVANCE_QUESTION',
    })

    expect(state.currentQuestionIndex).toBe(1)
  })

  it('does not advance without an answer', () => {
    const state = startTest()

    expect(
      testSessionReducer(state, { type: 'ADVANCE_QUESTION' }),
    ).toBe(state)
  })

  it('does not accept a choice from another question', () => {
    const state = startTest()

    expect(
      testSessionReducer(state, {
        type: 'ANSWER_QUESTION',
        choiceId: questions[1].choices[0].id,
      }),
    ).toBe(state)
  })

  it('requires all ten answers before completing', () => {
    let state = startTest()

    for (const question of questions.slice(0, -1)) {
      state = testSessionReducer(state, {
        type: 'ANSWER_QUESTION',
        choiceId: question.choices[0].id,
      })
      state = testSessionReducer(state, { type: 'ADVANCE_QUESTION' })
    }

    expect(questions).toHaveLength(10)
    expect(state.selectedAnswers).toHaveLength(9)
    expect(testSessionReducer(state, { type: 'COMPLETE_TEST' })).toBe(
      state,
    )
  })

  it('completes all ten questions and calculates a gamer-class result', () => {
    const state = completeTest()

    expect(state.selectedAnswers).toHaveLength(10)
    expect(state.isComplete).toBe(true)
    expect(state.result).not.toBeNull()
    expect(
      gamerClasses.some(
        (gamerClass) => gamerClass.id === state.result?.gamerClass.id,
      ),
    ).toBe(true)
  })

  it('starts over with a clean session', () => {
    const state = testSessionReducer(completeTest(), { type: 'START_TEST' })

    expect(state).toEqual({
      ...initialTestSessionState,
      isStarted: true,
    })
  })

  it('resets a session to its initial state', () => {
    const state = testSessionReducer(completeTest(), { type: 'RESET_TEST' })

    expect(state).toEqual(initialTestSessionState)
  })
})
