import { characters } from './data/characters'
import { questions } from './data/questions'
import { calculateResult as calculatePersonalityResult } from './scoring'
import type { PersonalityResult, Question, SelectedAnswer } from './types'

export interface TestSessionState {
  readonly isStarted: boolean
  readonly currentQuestionIndex: number
  readonly selectedAnswers: readonly SelectedAnswer[]
  readonly isComplete: boolean
  readonly result: PersonalityResult | null
  readonly storyFlags: Readonly<Record<string, boolean | string>>
}

export type TestSessionAction =
  | { readonly type: 'START_TEST' }
  | { readonly type: 'ANSWER_QUESTION'; readonly choiceId: string }
  | { readonly type: 'ADVANCE_QUESTION' }
  | { readonly type: 'COMPLETE_TEST' }
  | { readonly type: 'RESET_TEST' }

export type TestSessionReducer = (
  state: TestSessionState,
  action: TestSessionAction,
) => TestSessionState

export interface TestSessionReducerConfiguration {
  readonly questions: readonly Question[]
  readonly calculateResult: (
    selectedAnswers: readonly SelectedAnswer[],
  ) => PersonalityResult
}

export const initialTestSessionState: TestSessionState = {
  isStarted: false,
  currentQuestionIndex: 0,
  selectedAnswers: [],
  isComplete: false,
  result: null,
  storyFlags: {},
}

function startNewTest(): TestSessionState {
  return {
    ...initialTestSessionState,
    isStarted: true,
    selectedAnswers: [],
    storyFlags: {},
  }
}

function resetTest(): TestSessionState {
  return {
    ...initialTestSessionState,
    selectedAnswers: [],
    storyFlags: {},
  }
}

export function createTestSessionReducer({
  questions: configuredQuestions,
  calculateResult,
}: TestSessionReducerConfiguration): TestSessionReducer {
  return (state, action): TestSessionState => {
    switch (action.type) {
      case 'START_TEST':
        return startNewTest()

      case 'ANSWER_QUESTION': {
        if (!state.isStarted || state.isComplete) {
          return state
        }

        const currentQuestion =
          configuredQuestions[state.currentQuestionIndex]
        const isKnownChoice = currentQuestion?.choices.some(
          (choice) => choice.id === action.choiceId,
        )

        if (!currentQuestion || !isKnownChoice) {
          return state
        }

        const existingAnswerIndex = state.selectedAnswers.findIndex(
          (answer) => answer.questionId === currentQuestion.id,
        )
        const selectedAnswer: SelectedAnswer = {
          questionId: currentQuestion.id,
          choiceId: action.choiceId,
        }

        if (existingAnswerIndex === -1) {
          return {
            ...state,
            selectedAnswers: [...state.selectedAnswers, selectedAnswer],
          }
        }

        if (
          state.selectedAnswers[existingAnswerIndex]?.choiceId ===
          action.choiceId
        ) {
          return state
        }

        return {
          ...state,
          selectedAnswers: state.selectedAnswers.map((answer, index) =>
            index === existingAnswerIndex ? selectedAnswer : answer,
          ),
        }
      }

      case 'ADVANCE_QUESTION': {
        if (!state.isStarted || state.isComplete) {
          return state
        }

        const currentQuestion =
          configuredQuestions[state.currentQuestionIndex]
        const hasSelectedAnswer = state.selectedAnswers.some(
          (answer) => answer.questionId === currentQuestion?.id,
        )
        const isFinalQuestion =
          state.currentQuestionIndex >= configuredQuestions.length - 1

        if (!currentQuestion || !hasSelectedAnswer || isFinalQuestion) {
          return state
        }

        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
        }
      }

      case 'COMPLETE_TEST': {
        if (!state.isStarted || state.isComplete) {
          return state
        }

        const hasAnsweredEveryQuestion =
          configuredQuestions.length > 0 &&
          configuredQuestions.every((question) =>
            state.selectedAnswers.some(
              (answer) => answer.questionId === question.id,
            ),
          )

        if (!hasAnsweredEveryQuestion) {
          return state
        }

        return {
          ...state,
          isComplete: true,
          result: calculateResult(state.selectedAnswers),
        }
      }

      case 'RESET_TEST':
        return resetTest()
    }
  }
}

export const testSessionReducer = createTestSessionReducer({
  questions,
  calculateResult: (selectedAnswers) =>
    calculatePersonalityResult(selectedAnswers, questions, characters),
})
