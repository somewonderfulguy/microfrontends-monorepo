import React, { HTMLProps } from 'react'

import cybercat from './assets/cybercat.jpg'

export interface IBlockProps extends HTMLProps<HTMLDivElement> {
  withCybercat?: boolean
}

const Block = ({ children, withCybercat, ...props }: IBlockProps) => (
  <div {...props}>
    {withCybercat && <img src={cybercat} alt="Cybercat 2077" />}
    {children}
  </div>
)

export default Block