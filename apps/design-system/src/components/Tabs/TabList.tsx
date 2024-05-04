import { HTMLAttributes, forwardRef, useEffect, useState } from 'react'
import {
  TabList as ReactTabList,
  TabListProps as ReactTabListProps
} from '@reach/tabs'
import { animated } from 'react-spring'

import useResizeObserver from '@repo/shared/hooks/useResizeObserver'

import { IndicatorPositionProvider, useTabsInternalValue } from './contexts'
import { useIndicatorPosition, useTrackIndicatorPosition } from './hooks'

import styles from './styles/Tabs.module.css'

const TabList = forwardRef<
  HTMLDivElement,
  ReactTabListProps & HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <IndicatorPositionProvider>
      <TabListImpl {...props} ref={ref}>
        {children}
      </TabListImpl>
    </IndicatorPositionProvider>
  )
})
TabList.displayName = 'TabListContextWrapper'

const TabListImpl = forwardRef<
  HTMLDivElement,
  ReactTabListProps & HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const tabsStyle = useTabsInternalValue((state) => state.type)
  const tabsQty = useTabsInternalValue((state) => state.tabsQty)
  const isHexagon = tabsStyle === 'hexagon'
  const isUnderline = tabsStyle === 'underline'

  const [tabs, setTabs] = useState<HTMLButtonElement[]>([])

  const [containerWidth, setContainerWidth] = useState(0)
  const refWrapper = useResizeObserver(
    (bounds) => setContainerWidth(bounds.width),
    100
  )

  useEffect(() => {
    if (!refWrapper.current) return
    const tabs = refWrapper.current.querySelectorAll('[data-reach-tab]')
    setTabs(Array.from(tabs) as HTMLButtonElement[])
  }, [refWrapper, tabsQty])

  const { indicatorLeft, indicatorWidth } = useIndicatorPosition(
    tabs,
    refWrapper,
    containerWidth
  )

  const animatedRef = useTrackIndicatorPosition()

  return (
    <div ref={refWrapper} className={styles.tabListContainer}>
      <ReactTabList
        {...props}
        ref={ref}
        {...(isHexagon && { 'data-augmented-ui': 'tl-clip br-clip border' })}
      >
        {(isHexagon || isUnderline) && (
          <animated.div
            className={styles.indicator}
            aria-hidden
            style={{
              ...indicatorLeft,
              ...indicatorWidth,
              ...(isUnderline && { bottom: 0, height: 2 })
            }}
            ref={animatedRef}
          />
        )}
        {children}
      </ReactTabList>
    </div>
  )
})
TabListImpl.displayName = 'TabListWrapper'

export default TabList
