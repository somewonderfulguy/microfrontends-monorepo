import { CSSProperties, ReactNode } from 'react'

import useResizeObserver from '@hooks/useResizeObserver'

import styles from './TextCard.module.css'

type Props = {
  style?: CSSProperties
  className?: string
  children?: ReactNode
}

const TextCard = ({ style, className, children }: Props) => {
  const [bindResizeObserver, { height }] = useResizeObserver<HTMLDivElement>()

  return (
    <div
      className={styles.infoContainer + ' ' + (className ?? '')}
      style={{ ...style, height: !height ? 'auto' : `${height}px` }}
      data-augmented-ui="tr-2-clip-x br-clip-y border"
    >
      <div className={styles.info}>
        <div className={styles.innerShapeContainer}>
          <div
            className={styles.innerShape}
            data-augmented-ui="tr-clip br-clip"
          />
        </div>
        <div className={styles.outerShapeContainer}>
          <div
            className={styles.outerShape}
            data-augmented-ui="tr-clip br-clip"
          />
        </div>
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
