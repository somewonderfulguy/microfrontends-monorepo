'use client'

import { CSSProperties, HTMLAttributes, useState } from 'react'

import useResizeObserver from '@repo/shared/hooks/useResizeObserver'
import classNames from '@repo/shared/utils/classNames'
import { useThemeStore } from '@repo/state/themeStore'

import styles from './Button.module.css'

// TODO: active state for filled buttons
// TODO: focus state for filled buttons

// Base properties for all buttons
type PropsBase = HTMLAttributes<HTMLDivElement> & {
  /** Standard HTML Button `type` attribute, `button` is default */
  type?: 'button' | 'submit' | 'reset'
  /** `filled` (default) - filled button; `svg` - button with SVG icon */
  buttonStyle?: 'filled' | 'svg'
  /** `standard` (default) - 232px width and 48px height; `small` - 193px and 40px height */
  buttonSize?: 'small' | 'standard'
  /** Active state - for toggle buttons */
  active?: boolean
  /** Cut top left corner */
  cutTopLeftCorner?: boolean
  /** Cut bottom left corner */
  cutBottomLeftCorner?: boolean
  /** Cut top right corner */
  cutTopRightCorner?: boolean
  /** Cut bottom right corner - it is a default one (if no other cut selected) */
  cutBottomRightCorner?: boolean
  /** Rectangular cut on the left side - cannot be used with cuts of left corners */
  cutLeft?: boolean
  /** Rectangular cut on the right side - cannot be used with cuts of right corners */
  cutRight?: boolean
  /** Attributes for button */
  buttonProps?: HTMLAttributes<HTMLButtonElement>
}

// Conditionally apply exclusivity based on whether cutLeft or cutRight is true
type Props = PropsBase &
  (
    | (PropsBase & {
        cutLeft: true
        cutTopLeftCorner?: never
        cutBottomLeftCorner?: never
      })
    | (PropsBase & {
        cutRight: true
        cutTopRightCorner?: never
        cutBottomRightCorner?: never
      })
    | (PropsBase & { cutLeft?: false; cutRight?: false })
  )

const Button = ({
  type = 'button',
  buttonStyle = 'filled',
  buttonSize = 'standard',
  active = false,
  cutTopLeftCorner,
  cutTopRightCorner,
  cutBottomLeftCorner,
  cutBottomRightCorner,
  cutRight,
  cutLeft,
  children,
  className = '',
  buttonProps,
  style,
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

  const theme = useThemeStore((s) => s)

  const isSvg = buttonStyle === 'svg'

  return (
    <div
      {...props}
      className={classNames(
        styles.buttonWrapper,
        buttonSize === 'small' && styles.small,
        buttonStyle === 'filled' && styles.buttonFilled,
        isSvg && styles.buttonSvg,
        className
      )}
      data-augmented-ui={
        isSvg
          ? ''
          : classNames(
              // borders
              (theme === 'darkRed' || theme === 'dark') && 'border',

              // size corner cuts
              cutLeft && 'l-rect-x',
              cutRight && 'r-rect-x',

              // corners cuts
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
            )
      }
      ref={wrapperRef}
      style={
        {
          ...style,
          // TODO: move to CSS
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
        {...(active && { 'aria-pressed': 'true' })}
        type={type}
        {...buttonProps}
        className={classNames(styles.button, buttonProps?.className)}
      >
        {/* nbsp keeps layout in shape for augmented-ui */}
        {children || <>&nbsp;</>}
        {isSvg && (
          <div aria-hidden className={styles.svgGlow}>
            {children}
          </div>
        )}
      </button>
    </div>
  )
}

export default Button
