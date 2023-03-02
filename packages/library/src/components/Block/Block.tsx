import React, { ForwardedRef, forwardRef, HTMLProps, useImperativeHandle } from 'react'

import cybercat from './assets/cybercat.jpg'

export interface IBlockProps extends HTMLProps<HTMLDivElement> {
  withCybercat?: boolean
}

export const altText = 'Cybercat 2077'

const Block = forwardRef(({ children, withCybercat, ...props }: IBlockProps, ref: ForwardedRef<{ log: () => void }>) => {
  useImperativeHandle(ref, () => ({ log: () => alert('Well done. Now, stop doing it!') }));
  return (
    <div {...props}>
      {withCybercat && <div><img src={cybercat} alt={altText} /></div>}
      {children}
    </div>
  )
})
Block.displayName = 'Block'

export default Block