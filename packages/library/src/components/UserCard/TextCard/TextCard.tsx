import { CSSProperties, ReactNode, useLayoutEffect, useRef } from 'react'

import useResizeObserver from '@hooks/useResizeObserver'

import styles from './TextCard.module.css'

type Props = {
  style?: CSSProperties
  className?: string
  children?: ReactNode
}

const TextCard = ({ style, className, children }: Props) => {
  const [bindResizeObserver, { height }] = useResizeObserver<HTMLDivElement>()

  const outerShapeRef = useRef<HTMLDivElement | null>(null)
  const innerShapeRef = useRef<HTMLDivElement | null>(null)
  // keep useLayoutEffect - it affects how nicely position updates when content changes
  useLayoutEffect(() => {
    if (!innerShapeRef.current || !outerShapeRef.current) return

    const innerShape = innerShapeRef.current
    const innerHeight = height - 105
    innerShape.style.setProperty(
      '--aug-tr',
      `${innerHeight < 70 ? 70 : innerHeight}px`
    )

    const outerShape = outerShapeRef.current
    const outerHeightTop = height - 125
    outerShape.style.setProperty(
      '--aug-tr-extend2',
      `${outerHeightTop < 51 ? 51 : height - 125}px`
    )
    outerShape.style.setProperty('--block-height', `${height}px`)

    return () => {
      innerShape?.style.removeProperty('--aug-tr')
      outerShape?.style.removeProperty('--aug-tr-extend2')
      outerShape?.style.removeProperty('--block-height')
    }
  }, [height])

  return (
    <div
      className={styles.infoContainer + ' ' + (className ?? '')}
      style={{ ...style, height: !height ? 'auto' : `${height}px` }}
      // data-augmented-ui="tr-2-clip-x br-clip-y border"
      // data-augmented-ui="tr-2-clip-x border"
      data-augmented-ui={`tr-2-clip-x border ${
        height > 150 ? 'br-clip-y' : ''
      }`}
      ref={outerShapeRef}
    >
      <div className={styles.info}>
        <div className={styles.innerShapeContainer}>
          <div
            className={styles.innerShape}
            data-augmented-ui="tr-clip br-clip"
            ref={innerShapeRef}
          />
        </div>
        <div className={styles.outerShapeContainer} />
        <div ref={bindResizeObserver}>
          <p className={styles.shortDescription}>
            {children ?? 'No description_'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TextCard
