export const traits = ['collaboration', 'structure', 'adaptability'] as const

export type Trait = (typeof traits)[number]

export type QuestionId = string

export type ChoiceId = string

export type CharacterId = string

export type TraitEffects = Readonly<Partial<Record<Trait, number>>>

export type CharacterEffects = Readonly<Partial<Record<CharacterId, number>>>

export interface NarrativeMetadata {
  readonly label?: string
  readonly location?: string
}

export interface NarrativeEffect {
  readonly flag: string
  readonly value: boolean | string
}

export interface Choice {
  readonly id: ChoiceId
  readonly text: string
  readonly traitEffects: TraitEffects
  readonly characterEffects?: CharacterEffects
  readonly narrativeEffects?: readonly NarrativeEffect[]
}

export interface Question {
  readonly id: QuestionId
  readonly title: string
  readonly scenario: string
  readonly narrative?: NarrativeMetadata
  readonly choices: readonly Choice[]
}

export interface CharacterImage {
  readonly src: string
  readonly alt: string
}

export interface CharacterAbility {
  readonly name: string
  readonly description: string
}

export interface CharacterResult {
  readonly id: CharacterId
  readonly name: string
  readonly title: string
  readonly description: string
  readonly strengths: readonly string[]
  readonly growthArea: string
  readonly primaryTrait: Trait
  readonly secondaryTrait: Trait
  readonly image?: CharacterImage
  readonly ability?: CharacterAbility
}

export interface SelectedAnswer {
  readonly questionId: QuestionId
  readonly choiceId: ChoiceId
}

export type TraitScores = Readonly<Record<Trait, number>>

export type CharacterScores = Readonly<Record<CharacterId, number>>

export interface ScoreSummary {
  readonly traitScores: TraitScores
  readonly characterScores: CharacterScores
}

export interface PersonalityResult extends ScoreSummary {
  readonly character: CharacterResult
  readonly winningScore: number
}

export type TestResult = PersonalityResult

export interface ScoringConfig {
  readonly primaryTraitWeight: number
  readonly secondaryTraitWeight: number
  readonly characterTieBreakOrder: readonly CharacterId[]
}
