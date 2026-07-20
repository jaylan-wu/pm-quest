import type { Question } from '../types'

export const questions = [
  {
    id: 'session-opening',
    title: 'Start the session',
    scenario: 'The group is ready to begin. What do you do first?',
    narrative: { label: 'Opening' },
    choices: [
      {
        id: 'session-opening-check-in',
        text: 'Invite a quick check-in.',
        traitEffects: { collaboration: 2 },
        narrativeEffects: [{ flag: 'opened-with-check-in', value: true }],
      },
      {
        id: 'session-opening-outline',
        text: 'Share a short plan.',
        traitEffects: { structure: 2 },
      },
      {
        id: 'session-opening-adjust',
        text: 'Ask what the group needs today.',
        traitEffects: { adaptability: 2 },
      },
    ],
  },
  {
    id: 'unclear-direction',
    title: 'Clarify the task',
    scenario: 'The instructions feel unclear. How do you respond?',
    choices: [
      {
        id: 'unclear-direction-discuss',
        text: 'Compare interpretations together.',
        traitEffects: { collaboration: 2 },
      },
      {
        id: 'unclear-direction-break-down',
        text: 'Break the task into steps.',
        traitEffects: { structure: 2 },
      },
      {
        id: 'unclear-direction-try',
        text: 'Try a small example and adjust.',
        traitEffects: { adaptability: 2 },
      },
    ],
  },
  {
    id: 'quiet-group',
    title: 'Engage the group',
    scenario: 'Few people are speaking. What is your next move?',
    choices: [
      {
        id: 'quiet-group-pairs',
        text: 'Let people talk in pairs.',
        traitEffects: { collaboration: 2 },
      },
      {
        id: 'quiet-group-prompt',
        text: 'Offer one focused prompt.',
        traitEffects: { structure: 2 },
      },
      {
        id: 'quiet-group-format',
        text: 'Switch to a different format.',
        traitEffects: { adaptability: 2 },
      },
    ],
  },
  {
    id: 'limited-time',
    title: 'Manage the time',
    scenario: 'Time is running short. What do you prioritize?',
    choices: [
      {
        id: 'limited-time-agree',
        text: 'Agree on the shared priority.',
        traitEffects: { collaboration: 2 },
      },
      {
        id: 'limited-time-milestone',
        text: 'Set one clear milestone.',
        traitEffects: { structure: 2 },
      },
      {
        id: 'limited-time-simplify',
        text: 'Simplify the activity.',
        traitEffects: { adaptability: 2 },
      },
    ],
  },
  {
    id: 'different-views',
    title: 'Handle different views',
    scenario: 'Two approaches compete. How do you help?',
    choices: [
      {
        id: 'different-views-listen',
        text: 'Invite each person to explain.',
        traitEffects: { collaboration: 2 },
      },
      {
        id: 'different-views-criteria',
        text: 'Compare them with shared criteria.',
        traitEffects: { structure: 2 },
      },
      {
        id: 'different-views-combine',
        text: 'Test a blend of both.',
        traitEffects: { adaptability: 2 },
      },
    ],
  },
  {
    id: 'tool-problem',
    title: 'Respond to a problem',
    scenario: 'A planned tool stops working. What do you do?',
    choices: [
      {
        id: 'tool-problem-team',
        text: 'Ask the group for alternatives.',
        traitEffects: { collaboration: 2 },
      },
      {
        id: 'tool-problem-backup',
        text: 'Use the prepared backup.',
        traitEffects: { structure: 2 },
      },
      {
        id: 'tool-problem-pivot',
        text: 'Move to a low-tech option.',
        traitEffects: { adaptability: 2 },
      },
    ],
  },
  {
    id: 'feedback-moment',
    title: 'Offer feedback',
    scenario: 'Someone asks for feedback. How do you begin?',
    choices: [
      {
        id: 'feedback-moment-goal',
        text: 'Ask about their goal.',
        traitEffects: { collaboration: 2 },
      },
      {
        id: 'feedback-moment-points',
        text: 'Share two specific points.',
        traitEffects: { structure: 2 },
      },
      {
        id: 'feedback-moment-example',
        text: 'Explore a revised example.',
        traitEffects: { adaptability: 2 },
      },
    ],
  },
  {
    id: 'session-close',
    title: 'Close the session',
    scenario: 'The session is ending. What do you include?',
    narrative: { label: 'Closing' },
    choices: [
      {
        id: 'session-close-reflect',
        text: 'Invite a shared reflection.',
        traitEffects: { collaboration: 2 },
      },
      {
        id: 'session-close-summary',
        text: 'Summarize the key points.',
        traitEffects: { structure: 2 },
      },
      {
        id: 'session-close-next-step',
        text: 'Choose a flexible next step.',
        traitEffects: { adaptability: 2 },
      },
    ],
  },
] as const satisfies readonly Question[]
