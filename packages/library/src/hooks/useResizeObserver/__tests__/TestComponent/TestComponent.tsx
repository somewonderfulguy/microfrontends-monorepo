import { useEffect, useState } from 'react'

import useResizeObserver from '../../useResizeObserver'

type PropType = {
  delay?: number
  initialBounds?: { left: number; top: number; width: number; height: number }
  doNotBind?: boolean
}

const TestComponent = ({ delay, initialBounds, doNotBind }: PropType) => {
  const [{ width, height, left, top }, setBounds] = useState(
    initialBounds ?? {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    }
  )
  const bindResizeObserver = useResizeObserver<HTMLDivElement>(
    setBounds,
    delay,
    initialBounds
  )

  useEffect(() => {
    const div = bindResizeObserver.current
    if (!div) return

    // these resize attempts are actually seems to be ignored by JEST, however, let it be
    div.style.width = '100px'
    div.style.height = '100px'
    div.dispatchEvent(new Event('resize'))
  }, [bindResizeObserver])

  return (
    <div ref={doNotBind ? null : bindResizeObserver}>
      <div>width: {width}</div>
      <div>height: {height}</div>
      <div>top: {top}</div>
      <div>left: {left}</div>
    </div>
  )
}

export default TestComponent
