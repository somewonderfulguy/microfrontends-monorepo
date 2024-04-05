import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react'
import { TabPanels as ReachTabPanels, TabPanelsProps } from '@reach/tabs'
import { animated, useSpring } from 'react-spring'

import useResizeObserver from 'hooks/useResizeObserver'

const TabPanels = forwardRef<
  HTMLDivElement,
  TabPanelsProps & HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const [height, setHeight] = useState(0)
  const wrapperRef = useResizeObserver(
    (bounds) => setHeight(bounds.height),
    100
  )

  const isInitialRender = useRef(true)
  const animatedHeight = useSpring({
    config: {
      duration: isInitialRender.current ? 0 : 200
    },
    immediate: isInitialRender.current,
    height
  })
  useEffect(() => {
    // TODO: verify is it really needed
    setTimeout(() => (isInitialRender.current = false))
  }, [])

  return (
    <animated.div
      style={{
        height: isInitialRender.current ? 'auto' : animatedHeight.height
      }}
    >
      <div ref={wrapperRef}>
        <ReachTabPanels {...props} ref={ref} />
      </div>
    </animated.div>
  )
})
TabPanels.displayName = 'TabPanelsWrapper'

export default TabPanels
