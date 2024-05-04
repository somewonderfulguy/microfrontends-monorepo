import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react'
import { TabPanels as ReachTabPanels, TabPanelsProps } from '@reach/tabs'
import { animated, useSpring } from 'react-spring'

import useResizeObserver from '@repo/shared/hooks/useResizeObserver'

type Props = TabPanelsProps &
  HTMLAttributes<HTMLDivElement> & {
    /** Optionally disable height animation and remove two wrapper div blocks for doing height calculation/animation */
    disableHeightAnimation?: boolean
  }

const TabPanels = forwardRef<HTMLDivElement, Props>(
  ({ disableHeightAnimation = false, ...props }, ref) => {
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
      immediate: isInitialRender.current || disableHeightAnimation,
      height
    })
    useEffect(() => {
      // TODO: verify is it really needed
      setTimeout(() => (isInitialRender.current = false))
    }, [])

    const content = <ReachTabPanels {...props} ref={ref} />

    // TODO: implement conditional rendering of useSpring by making additional Component
    return disableHeightAnimation ? (
      content
    ) : (
      <animated.div
        style={{
          height: isInitialRender.current ? 'auto' : animatedHeight.height
        }}
      >
        <div ref={wrapperRef}>{content}</div>
      </animated.div>
    )
  }
)
TabPanels.displayName = 'TabPanelsWrapper'

export default TabPanels
