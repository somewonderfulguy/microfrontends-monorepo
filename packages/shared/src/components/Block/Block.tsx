import React, { HTMLProps } from 'react'

import cybercat from './assets/cybercat.jpg'

export interface IBlockProps extends HTMLProps<HTMLDivElement> {
  withCybercat?: boolean
}

export const altText = 'Cybercat 2077'

const Block = ({ children, withCybercat, ...props }: IBlockProps) => (
  <div {...props}>
    {withCybercat && <img src={cybercat} alt={altText} />}
    {children}
  </div>
)

export default Block