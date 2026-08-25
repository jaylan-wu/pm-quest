import { scoringConfig } from './data/scoringConfig'
import {
  GAMER_CLASS_IDS,
  type GamerClass,
  type GamerClassId,
  type GamerClassResult,
  type GamerClassScores,
  type QuizChoice,
  type QuizQuestion,
  type ScoreSummary,
  type ScoringConfig,
  type SelectedAnswer,
} from './types'

const STRONG_ASSOCIATION_SCORE = 3

function createEmptyClassScores(): Record<GamerClassId, number> {
  return {
    moba: 0,
    fps: 0,
    rpg: 0,
    sports: 0,
    sandbox: 0,
    mobile: 0,
    tabletop: 0,
  }
}

function isGamerClassId(value: string): value is GamerClassId {
  return GAMER_CLASS_IDS.some((gamerClassId) => gamerClassId === value)
}

function validateQuestions(questionsToScore: readonly QuizQuestion[]): void {
  const questionIds = new Set<string>()

  for (const question of questionsToScore) {
    if (questionIds.has(question.id)) {
      throw new Error(`Question ID must be unique: ${question.id}`)
    }

    questionIds.add(question.id)
    const choiceIds = new Set<string>()

    for (const choice of question.choices) {
      if (choiceIds.has(choice.id)) {
        throw new Error(`Choice ID must be unique within question ${question.id}: ${choice.id}`)
      }

      choiceIds.add(choice.id)

      for (const [classId, score] of Object.entries(choice.scores)) {
        if (!isGamerClassId(classId)) {
          throw new Error(`Unknown gamer class ID in choice ${choice.id}: ${classId}`)
        }

        if (!Number.isInteger(score) || score < 0 || score > STRONG_ASSOCIATION_SCORE) {
          throw new Error(`Score for ${classId} in choice ${choice.id} must be 0, 1, 2, or 3`)
        }
      }
    }
  }
}

function validateScoringConfiguration(
  gamerClassesToScore: readonly GamerClass[],
  config: ScoringConfig,
): void {
  const configuredClassIds = new Set(
    gamerClassesToScore.map((gamerClass) => gamerClass.id),
  )

  if (
    configuredClassIds.size !== GAMER_CLASS_IDS.length ||
    gamerClassesToScore.length !== GAMER_CLASS_IDS.length ||
    GAMER_CLASS_IDS.some((gamerClassId) => !configuredClassIds.has(gamerClassId))
  ) {
    throw new Error('Gamer-class data must contain every gamer class ID exactly once')
  }

  const priorityIds = new Set(config.gamerClassTieBreakOrder)

  if (
    priorityIds.size !== config.gamerClassTieBreakOrder.length ||
    priorityIds.size !== configuredClassIds.size ||
    config.gamerClassTieBreakOrder.some(
      (gamerClassId) => !configuredClassIds.has(gamerClassId),
    )
  ) {
    throw new Error('Tie-break order must contain every gamer class ID exactly once')
  }
}

function findSelectedChoice(
  answer: SelectedAnswer,
  questionById: ReadonlyMap<string, QuizQuestion>,
): QuizChoice {
  const question = questionById.get(answer.questionId)

  if (!question) {
    throw new Error(`Unknown question ID: ${answer.questionId}`)
  }

  const choice = question.choices.find(
    (candidate) => candidate.id === answer.choiceId,
  )

  if (!choice) {
    throw new Error(
      `Unknown choice ID ${answer.choiceId} for question ${answer.questionId}`,
    )
  }

  return choice
}

export function calculateScores(
  answers: readonly SelectedAnswer[],
  questionsToScore: readonly QuizQuestion[],
): ScoreSummary {
  validateQuestions(questionsToScore)

  const questionById = new Map(
    questionsToScore.map((question) => [question.id, question] as const),
  )
  const answeredQuestionIds = new Set<string>()
  const classScores = createEmptyClassScores()
  const strongAssociationCounts = createEmptyClassScores()
  const contributingQuestionCounts = createEmptyClassScores()

  for (const answer of answers) {
    if (answeredQuestionIds.has(answer.questionId)) {
      throw new Error(`Question answered more than once: ${answer.questionId}`)
    }

    answeredQuestionIds.add(answer.questionId)
    const choice = findSelectedChoice(answer, questionById)

    for (const gamerClassId of GAMER_CLASS_IDS) {
      const contribution = choice.scores[gamerClassId] ?? 0
      classScores[gamerClassId] += contribution

      if (contribution === STRONG_ASSOCIATION_SCORE) {
        strongAssociationCounts[gamerClassId] += 1
      }

      if (contribution > 0) {
        contributingQuestionCounts[gamerClassId] += 1
      }
    }
  }

  return {
    classScores: classScores satisfies GamerClassScores,
    strongAssociationCounts: strongAssociationCounts satisfies GamerClassScores,
    contributingQuestionCounts:
      contributingQuestionCounts satisfies GamerClassScores,
  }
}

function candidateOutranksWinner(
  candidateId: GamerClassId,
  winnerId: GamerClassId,
  scores: ScoreSummary,
): boolean {
  if (scores.classScores[candidateId] !== scores.classScores[winnerId]) {
    return scores.classScores[candidateId] > scores.classScores[winnerId]
  }

  if (
    scores.strongAssociationCounts[candidateId] !==
    scores.strongAssociationCounts[winnerId]
  ) {
    return (
      scores.strongAssociationCounts[candidateId] >
      scores.strongAssociationCounts[winnerId]
    )
  }

  return (
    scores.contributingQuestionCounts[candidateId] >
    scores.contributingQuestionCounts[winnerId]
  )
}

export function selectWinningGamerClass(
  scores: ScoreSummary,
  gamerClassesToScore: readonly GamerClass[],
  config: ScoringConfig = scoringConfig,
): GamerClass {
  validateScoringConfiguration(gamerClassesToScore, config)

  const gamerClassById = new Map(
    gamerClassesToScore.map((gamerClass) => [gamerClass.id, gamerClass] as const),
  )
  const firstPriorityId = config.gamerClassTieBreakOrder[0]

  if (firstPriorityId === undefined) {
    throw new Error('Tie-break order must contain every gamer class ID exactly once')
  }

  let winnerId = firstPriorityId

  for (const candidateId of config.gamerClassTieBreakOrder.slice(1)) {
    if (candidateOutranksWinner(candidateId, winnerId, scores)) {
      winnerId = candidateId
    }
  }

  const winner = gamerClassById.get(winnerId)

  if (!winner) {
    throw new Error(`Unknown gamer class in tie-break order: ${winnerId}`)
  }

  return winner
}

export function calculateResult(
  answers: readonly SelectedAnswer[],
  questionsToScore: readonly QuizQuestion[],
  gamerClassesToScore: readonly GamerClass[],
  config: ScoringConfig = scoringConfig,
): GamerClassResult {
  const scores = calculateScores(answers, questionsToScore)
  const gamerClass = selectWinningGamerClass(
    scores,
    gamerClassesToScore,
    config,
  )

  return {
    gamerClass,
    winningScore: scores.classScores[gamerClass.id],
    ...scores,
  }
}
