import React, { ForwardedRef, forwardRef, HTMLProps, useImperativeHandle } from 'react'

import cybercat from './assets/cybercat.jpg'

export type BlockProps = HTMLProps<HTMLDivElement> & {
  withCybercat?: boolean
}

export const altText = 'Cybercat 2077'

export type ForwardedRefType = { log: () => void }

const Block = forwardRef(({ children, withCybercat, ...props }: BlockProps, ref: ForwardedRef<ForwardedRefType>) => {
  useImperativeHandle(ref, () => ({ log: () => alert('Well done. Now, stop doing it!') }))
  return (
    <div {...props}>
      {withCybercat && <div><img src={cybercat} alt={altText} /></div>}
      {children}
    </div>
  )
})
Block.displayName = 'Block'

export default Block