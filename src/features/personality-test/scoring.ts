import { scoringConfig } from './data/scoringConfig'
import {
  traits,
  type CharacterResult,
  type CharacterScores,
  type Choice,
  type PersonalityResult,
  type Question,
  type ScoreSummary,
  type ScoringConfig,
  type SelectedAnswer,
  type TraitScores,
} from './types'

function validateQuestions(questionsToScore: readonly Question[]): void {
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
    }
  }
}

function validateScoringConfiguration(
  charactersToScore: readonly CharacterResult[],
  config: ScoringConfig,
): void {
  if (charactersToScore.length === 0) {
    throw new Error('At least one character is required to calculate a result')
  }

  const characterIds = new Set(charactersToScore.map((character) => character.id))

  if (characterIds.size !== charactersToScore.length) {
    throw new Error('Character IDs must be unique')
  }

  const priorityIds = new Set(config.characterTieBreakOrder)

  if (
    priorityIds.size !== config.characterTieBreakOrder.length ||
    priorityIds.size !== characterIds.size ||
    config.characterTieBreakOrder.some((characterId) => !characterIds.has(characterId))
  ) {
    throw new Error('Tie-break order must contain every character ID exactly once')
  }
}

function findSelectedChoice(
  answer: SelectedAnswer,
  questionById: ReadonlyMap<string, Question>,
): Choice {
  const question = questionById.get(answer.questionId)

  if (!question) {
    throw new Error(`Unknown question ID: ${answer.questionId}`)
  }

  const choice = question.choices.find((candidate) => candidate.id === answer.choiceId)

  if (!choice) {
    throw new Error(
      `Unknown choice ID ${answer.choiceId} for question ${answer.questionId}`,
    )
  }

  return choice
}

function createEmptyTraitScores(): Record<(typeof traits)[number], number> {
  return {
    collaboration: 0,
    structure: 0,
    adaptability: 0,
  }
}

export function calculateScores(
  answers: readonly SelectedAnswer[],
  questionsToScore: readonly Question[],
  charactersToScore: readonly CharacterResult[],
  config: ScoringConfig = scoringConfig,
): ScoreSummary {
  validateQuestions(questionsToScore)
  validateScoringConfiguration(charactersToScore, config)

  const questionById = new Map(
    questionsToScore.map((question) => [question.id, question] as const),
  )
  const answeredQuestionIds = new Set<string>()
  const traitScores = createEmptyTraitScores()
  const directCharacterScores: Record<string, number> = Object.fromEntries(
    charactersToScore.map((character) => [character.id, 0]),
  )

  for (const answer of answers) {
    if (answeredQuestionIds.has(answer.questionId)) {
      throw new Error(`Question answered more than once: ${answer.questionId}`)
    }

    answeredQuestionIds.add(answer.questionId)
    const choice = findSelectedChoice(answer, questionById)

    for (const trait of traits) {
      traitScores[trait] += choice.traitEffects[trait] ?? 0
    }

    for (const character of charactersToScore) {
      directCharacterScores[character.id] += choice.characterEffects?.[character.id] ?? 0
    }
  }

  const characterScores: Record<string, number> = {}

  for (const character of charactersToScore) {
    characterScores[character.id] =
      directCharacterScores[character.id] +
      traitScores[character.primaryTrait] * config.primaryTraitWeight +
      traitScores[character.secondaryTrait] * config.secondaryTraitWeight
  }

  return {
    traitScores: traitScores satisfies TraitScores,
    characterScores: characterScores satisfies CharacterScores,
  }
}

export function selectWinningCharacter(
  characterScores: CharacterScores,
  charactersToScore: readonly CharacterResult[],
  config: ScoringConfig = scoringConfig,
): CharacterResult {
  validateScoringConfiguration(charactersToScore, config)

  const characterById = new Map(
    charactersToScore.map((character) => [character.id, character] as const),
  )
  const firstPriorityId = config.characterTieBreakOrder[0]
  const firstCharacter = characterById.get(firstPriorityId)

  if (!firstCharacter) {
    throw new Error('Tie-break order must begin with a configured character')
  }

  let winner = firstCharacter
  let winningScore = characterScores[winner.id]

  for (const characterId of config.characterTieBreakOrder.slice(1)) {
    const character = characterById.get(characterId)

    if (!character) {
      throw new Error(`Unknown character in tie-break order: ${characterId}`)
    }

    const score = characterScores[characterId]

    if (score > winningScore) {
      winner = character
      winningScore = score
    }
  }

  return winner
}

export function calculateResult(
  answers: readonly SelectedAnswer[],
  questionsToScore: readonly Question[],
  charactersToScore: readonly CharacterResult[],
  config: ScoringConfig = scoringConfig,
): PersonalityResult {
  const scores = calculateScores(answers, questionsToScore, charactersToScore, config)
  const character = selectWinningCharacter(scores.characterScores, charactersToScore, config)

  return {
    character,
    winningScore: scores.characterScores[character.id],
    ...scores,
  }
}
