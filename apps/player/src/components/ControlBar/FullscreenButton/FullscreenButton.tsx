'use client'

import { useState } from 'react'

import Button from '@repo/design-system/controls/Button'

import ExpandButton from './assets/expand.svg?react'
import ShrinkButton from './assets/shrink.svg?react'

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <Button
      buttonStyle="svg"
      onClick={() => setIsFullscreen((prev) => !prev)}
      style={{ width: 18, height: 18 }}
    >
      {isFullscreen ? <ShrinkButton /> : <ExpandButton />}
    </Button>
  )
}

export default FullscreenButton
