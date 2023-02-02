import React, { HTMLProps } from 'react'

import { ReactComponent as PreviewIcon } from './assets/eye.svg'
import styles from './Button.module.css'

export interface IButtonProps extends HTMLProps<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset'
  isPreview?: boolean
}

const Button = ({ children, isPreview, ...props }: IButtonProps) => (
  <button {...props} className={styles.button} data-augmented-ui="bl-clip">
    {isPreview && <PreviewIcon className={styles.preview} />} {children}
  </button>
)

export default Button