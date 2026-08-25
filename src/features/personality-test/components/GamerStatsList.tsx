import type { ReactElement } from 'react'

import type { GamerStats } from '../types'

const gamerStatLabels = [
  ['teamwork', 'Teamwork'],
  ['strategy', 'Strategy'],
  ['creativity', 'Creativity'],
  ['competitiveness', 'Competitiveness'],
  ['adaptability', 'Adaptability'],
] as const satisfies readonly (readonly [keyof GamerStats, string])[]

export interface GamerStatsListProps {
  readonly stats: GamerStats
}

export function GamerStatsList({
  stats,
}: GamerStatsListProps): ReactElement {
  return (
    <dl className="character-stats gamer-stats-list">
      {gamerStatLabels.map(([stat, label]) => (
        <div key={stat}>
          <dt>{label}</dt>
          <dd>{stats[stat]} / 10</dd>
          <dd className="character-stat-visual" aria-hidden="true">
            <progress
              className="character-stat-meter"
              value={stats[stat]}
              max={10}
            />
          </dd>
        </div>
      ))}
    </dl>
  )
}
