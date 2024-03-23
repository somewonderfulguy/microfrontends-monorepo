import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react'
import { Tab as ReachTab, TabProps, useTabsContext } from '@reach/tabs'

import { useIndicatorPositionContext, useTabsInternalContext } from './contexts'

const Tab = forwardRef<
  HTMLButtonElement,
  TabProps & HTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
  const {
    type: tabsStyle,
    tabsQty,
    registerTab,
    unregisterTab
  } = useTabsInternalContext()
  const { selectedIndex } = useTabsContext()
  const isUnderline = tabsStyle === 'underline'
  const isHexagon = tabsStyle === 'hexagon'

  useEffect(() => {
    registerTab()
    return () => unregisterTab()
  }, [registerTab, unregisterTab])

  // TODO: move to external hook
  const {
    left: indicatorLeft,
    width: indicatorWidth,
    isGoingLeft
  } = useIndicatorPositionContext()

  const contentRef = useRef<HTMLDivElement>(null)
  const offsetLeft = contentRef.current?.parentElement?.offsetLeft || 0

  const [{ leftClip, rightClip }, setClipValues] = useState({
    leftClip: indicatorLeft - offsetLeft,
    rightClip: indicatorWidth + indicatorLeft - offsetLeft
  })
  useEffect(() => {
    setTimeout(() => {
      setClipValues({
        leftClip: indicatorLeft - offsetLeft,
        rightClip: indicatorWidth + indicatorLeft - offsetLeft
      })
    }, 0)
  }, [indicatorLeft, indicatorWidth, offsetLeft])

  // TODO: fix hardcoded values
  const thresholdRight = 24
  const thresholdLeft = 27
  const threshold = isGoingLeft ? thresholdLeft : thresholdRight

  return (
    <ReachTab {...props} ref={ref}>
      {/*
        data-reach-tab-clone is the same text but:
        - type `underline`: bold used for changing font-weight with transition animation
        - type `hexagon`: used to animate text when background is moving
      */}
      {(isUnderline || isHexagon) && (
        <div
          data-reach-tab-clone
          aria-hidden
          style={{
            // clip path is to animate text when background is moving
            clipPath: isHexagon
              ? `polygon(${leftClip - threshold}px 0, ${
                  rightClip - threshold
                }px 0, ${rightClip - threshold}px 100%, ${
                  leftClip - threshold
                }px 100%)`
              : undefined
          }}
        >
          {children}
        </div>
      )}
      <div data-reach-tab-content ref={contentRef}>
        {children}
      </div>

      {isHexagon && (
        <div
          data-hexagon-focus
          aria-hidden
          data-augmented-ui={`${selectedIndex === 0 ? 'tl-clip' : ''} ${
            selectedIndex === tabsQty - 1 ? 'br-clip' : ''
          } border`}
        />
      )}
    </ReachTab>
  )
})
Tab.displayName = 'TabWrapper'

export default Tab
