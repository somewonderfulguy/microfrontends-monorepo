import React, { HTMLProps } from 'react'

export interface IButtonProps extends HTMLProps<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset'
}

const Button = (props: IButtonProps) => <button {...props} />

export default Button