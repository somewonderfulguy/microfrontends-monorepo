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

    // inner shape styling
    const innerShape = innerShapeRef.current
    const innerHeight = height - 105
    innerShape.style.setProperty(
      '--aug-tr',
      `${innerHeight < 70 ? 70 : innerHeight}px`
    )

    // outer shape top positioning
    const outerShape = outerShapeRef.current
    const outerHeightTop = height - 125
    outerShape.style.setProperty(
      '--aug-tr-extend2',
      `${outerHeightTop < 51 ? 51 : outerHeightTop}px`
    )

    // outer shape bottom positioning
    const outerHeightBottom = height - 140
    outerShape.style.setProperty(
      '--aug-br-inset2',
      `${height < 159 ? outerHeightBottom : 35}px`
    )

    // --block-height is for shape-outside (e.g. text wrapping)
    outerShape.style.setProperty(
      '--block-height',
      `${height < 175 ? 175 : height}px`
    )

    return () => {
      innerShape?.style.removeProperty('--aug-tr')
      outerShape?.style.removeProperty('--aug-tr-extend2')
      outerShape?.style.removeProperty('--aug-br-inset2')
      outerShape?.style.removeProperty('--block-height')
    }
  }, [height])

  return (
    <div
      className={styles.infoContainer + ' ' + (className ?? '')}
      style={{ ...style, height: !height ? 'auto' : `${height}px` }}
      data-augmented-ui="tr-2-clip-x br-clip-y border"
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
