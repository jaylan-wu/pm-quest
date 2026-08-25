import { useState, type ReactElement } from 'react'

import type { QuestionImage as QuestionImageData } from '../types'

export interface QuestionImageProps {
  readonly image?: QuestionImageData
}

export function QuestionImage({ image }: QuestionImageProps): ReactElement {
  const [failedSource, setFailedSource] = useState<string>()
  const [loadedSource, setLoadedSource] = useState<string>()
  const source = image?.src
  const alt = image?.alt ?? ''
  const position = image?.position ?? 'center'
  const hasUsableSource = source !== undefined && source.length > 0
  const hasFailed = hasUsableSource && failedSource === source
  const hasLoaded = hasUsableSource && loadedSource === source
  const shouldRenderImage = hasUsableSource && !hasFailed

  return (
    <div className="question-image">
      <div className="question-image__viewport">
        {shouldRenderImage ? (
          <img
            key={source}
            className={`question-image__media${
              hasLoaded ? ' question-image__media--loaded' : ''
            }`}
            src={source}
            alt={alt}
            width={16}
            height={9}
            style={{ objectPosition: position }}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            onLoad={() => setLoadedSource(source)}
            onError={() => setFailedSource(source)}
          />
        ) : null}

        {!hasLoaded || hasFailed ? (
          <div className="question-image__placeholder" aria-hidden="true">
            <span className="ui-label">
              {hasFailed ? 'Scene unavailable' : 'Loading scene'}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
