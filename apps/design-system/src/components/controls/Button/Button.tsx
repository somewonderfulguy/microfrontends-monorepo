import { CSSProperties, HTMLProps, useState } from 'react'

import useResizeObserver from '@repo/shared/hooks/useResizeObserver'
import classNames from '@repo/shared/utils/classNames'

import styles from './Button.module.css'

export type Props = HTMLProps<HTMLButtonElement> & {
  type?: 'button' | 'submit' | 'reset'
  buttonStyle?: 'filled' | 'outlined'
  cutTopLeftCorner?: boolean
  cutTopRightCorner?: boolean
  cutBottomLeftCorner?: boolean
  cutBottomRightCorner?: boolean
}

const Button = ({
  type = 'button',
  cutTopLeftCorner,
  cutTopRightCorner,
  cutBottomLeftCorner,
  cutBottomRightCorner,
  children,
  className = '',
  ...props
}: Props) => {
  const [widthStr, setWidthStr] = useState<'wide' | 'narrow'>('wide')
  const wrapperRef = useResizeObserver((bounds) => {
    if (bounds.width <= 100) {
      setWidthStr('narrow')
    } else {
      setWidthStr('wide')
    }
  })

  return (
    <div
      className={styles.buttonWrapper}
      data-augmented-ui={classNames(
        cutBottomLeftCorner && 'bl-clip',
        // if no corners are cut, use br-clip (cut bottom right corner)
        (cutBottomRightCorner ||
          (!cutBottomLeftCorner &&
            !cutBottomRightCorner &&
            !cutTopLeftCorner &&
            !cutTopRightCorner)) &&
          'br-clip',
        cutTopLeftCorner && 'tl-clip',
        cutTopRightCorner && 'tr-clip'
      )}
      ref={wrapperRef}
      style={
        {
          ...(widthStr === 'narrow' && {
            '--aug-bl': '9px',
            '--aug-br': '9px',
            '--aug-tl': '9px',
            '--aug-tr': '9px'
          })
        } as CSSProperties
      }
    >
      <button
        type={type}
        {...props}
        className={`${styles.button} ${className}`}
      >
        {/* nbsp keeps layout in shape for augmented-ui */}
        {children || <>&nbsp;</>}
      </button>
    </div>
  )
}

export default Button
