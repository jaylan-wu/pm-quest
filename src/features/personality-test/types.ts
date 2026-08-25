export type GamerClassId =
  | 'moba'
  | 'fps'
  | 'rpg'
  | 'sports'
  | 'sandbox'
  | 'mobile'
  | 'tabletop'

export const GAMER_CLASS_IDS = [
  'moba',
  'fps',
  'rpg',
  'sports',
  'sandbox',
  'mobile',
  'tabletop',
] as const satisfies readonly GamerClassId[]

export type QuestionId = string

export type ChoiceId = string

export type GamerClassScores = Readonly<Record<GamerClassId, number>>

export interface QuizChoice {
  readonly id: ChoiceId
  readonly text: string
  readonly scores: Readonly<Partial<Record<GamerClassId, number>>>
}

export interface QuestionImage {
  readonly src?: string
  readonly alt: string
  readonly position?: string
}

export interface QuizQuestion {
  readonly id: QuestionId
  readonly title: string
  readonly scenario?: string
  readonly image?: QuestionImage
  readonly choices: readonly QuizChoice[]
}

export interface GamerStats {
  readonly teamwork: number
  readonly strategy: number
  readonly creativity: number
  readonly competitiveness: number
  readonly adaptability: number
}

export interface GamerClass {
  readonly id: GamerClassId
  readonly name: string
  readonly description: string
  readonly stats: GamerStats
}

export interface SelectedAnswer {
  readonly questionId: QuestionId
  readonly choiceId: ChoiceId
}

export interface ScoreSummary {
  readonly classScores: GamerClassScores
  readonly strongAssociationCounts: GamerClassScores
  readonly contributingQuestionCounts: GamerClassScores
}

export interface GamerClassResult extends ScoreSummary {
  readonly gamerClass: GamerClass
  readonly winningScore: number
}

export type TestResult = GamerClassResult

export interface ScoringConfig {
  readonly gamerClassTieBreakOrder: readonly GamerClassId[]
}
