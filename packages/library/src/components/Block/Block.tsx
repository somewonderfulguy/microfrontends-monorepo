import React, { ForwardedRef, forwardRef, HTMLProps, useImperativeHandle } from 'react'

import cybercat from './assets/cybercat.jpg'
import blockJson from './Block.json'

export type BlockProps = HTMLProps<HTMLDivElement> & {
  withCybercat?: boolean
  withJohnySilverhand?: boolean
}

export const altText = 'Cybercat 2077'

export type ForwardedRefType = { log: () => void }

const Block = forwardRef(({ children, withCybercat, withJohnySilverhand, ...props }: BlockProps, ref: ForwardedRef<ForwardedRefType>) => {
  useImperativeHandle(ref, () => ({ log: () => alert('Well done. Now, stop doing it!') }))
  return (
    <div {...props}>
      {withCybercat && <div><img src={cybercat} alt={altText} /></div>}
      {/* TODO: add test case */}
      {withJohnySilverhand && <pre>{JSON.stringify(blockJson, undefined, 2)}</pre>}
      {children}
    </div>
  )
})
Block.displayName = 'Block'

export default Block