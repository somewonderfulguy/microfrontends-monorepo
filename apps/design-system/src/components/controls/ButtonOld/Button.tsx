import { HTMLProps } from 'react'

import PreviewIcon from './assets/eye.svg?react'
import styles from './Button.module.css'

export type ButtonProps = HTMLProps<HTMLButtonElement> & {
  type?: 'button' | 'submit' | 'reset'
  isPreview?: boolean
}

const Button = ({
  children,
  isPreview,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={styles.button}
    data-augmented-ui="bl-clip"
    type={type}
  >
    {isPreview && <PreviewIcon />} {children}
  </button>
)

export default Button
