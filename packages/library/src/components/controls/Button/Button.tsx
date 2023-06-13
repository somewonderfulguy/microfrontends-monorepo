import { HTMLProps } from 'react'

import { ReactComponent as PreviewIcon } from './assets/eye.svg'
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
    {isPreview && <PreviewIcon className={styles.preview} />} {children}
  </button>
)

export default Button
