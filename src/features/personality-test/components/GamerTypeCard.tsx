import type { ReactElement } from 'react'

import type { GamerClass } from '../types'
import { GamerStatsList } from './GamerStatsList'

export interface GamerTypeCardProps {
  readonly gamerClass: GamerClass
  readonly isCurrent?: boolean
}

export function GamerTypeCard({
  gamerClass,
  isCurrent = false,
}: GamerTypeCardProps): ReactElement {
  const titleId = `gamer-type-${gamerClass.id}-title`

  return (
    <article
      className={`surface gamer-type-card${isCurrent ? ' gamer-type-card-current' : ''}`}
      aria-labelledby={titleId}
    >
      {isCurrent ? (
        <p className="ui-label gamer-type-label">Your type</p>
      ) : null}
      <h2 className="gamer-type-name" id={titleId}>
        {gamerClass.name}
      </h2>
      <p className="gamer-type-description">{gamerClass.description}</p>

      <h3 className="ui-label gamer-type-stats-heading">Character stats</h3>
      <GamerStatsList stats={gamerClass.stats} />
    </article>
  )
}
