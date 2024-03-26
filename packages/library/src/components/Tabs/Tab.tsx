import { HTMLAttributes, forwardRef, useEffect, useRef } from 'react'
import { Tab as ReachTab, TabProps, useTabsContext } from '@reach/tabs'

import { useTabsInternalContext } from './contexts'
import HexagonAnimationBlock from './HexagonAnimationBlock'

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

  const contentRef = useRef<HTMLDivElement>(null)
  const isHover = useRef(false)

  return (
    <ReachTab
      {...props}
      ref={ref}
      onMouseEnter={() => (isHover.current = true)}
      onMouseLeave={() => (isHover.current = false)}
    >
      {/* data-reach-tab-clone is the same text but bold used for changing font-weight with transition animation */}
      {isUnderline && (
        <div data-reach-tab-clone aria-hidden>
          {children}
        </div>
      )}
      {isHexagon && (
        <>
          {/* <HexagonAnimationBlock> is used to animate text when background is moving */}
          <HexagonAnimationBlock contentRef={contentRef} isHover={isHover}>
            {children}
          </HexagonAnimationBlock>

          {/* focus outline for hexagon tabs */}
          <div
            data-hexagon-focus
            aria-hidden
            data-augmented-ui={`${selectedIndex === 0 ? 'tl-clip' : ''} ${
              selectedIndex === tabsQty - 1 ? 'br-clip' : ''
            } border`}
          />
        </>
      )}
      <div data-reach-tab-content ref={contentRef}>
        {children}
      </div>
    </ReachTab>
  )
})
Tab.displayName = 'TabWrapper'

export default Tab
