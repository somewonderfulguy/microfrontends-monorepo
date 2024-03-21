import { HTMLAttributes, forwardRef, useEffect, useState } from 'react'
import {
  TabList as ReactTabList,
  TabListProps as ReactTabListProps
} from '@reach/tabs'
import { animated } from 'react-spring'

import useResizeObserver from 'hooks/useResizeObserver'

import { IndicatorPositionProvider, useTabsInternalContext } from './contexts'
import { useIndicatorPosition, useTrackIndicatorPosition } from './hooks'

import styles from './styles/Tabs.module.css'

const TabList = forwardRef<
  HTMLDivElement,
  ReactTabListProps & HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const { type: tabsStyle, tabsQty } = useTabsInternalContext()
  const isHexagon = tabsStyle === 'hexagon'
  const isUnderline = tabsStyle === 'underline'

  const [tabs, setTabs] = useState<HTMLButtonElement[]>([])

  const [refWrapper, { width: containerWidth }] =
    useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (!refWrapper.current) return
    const tabs = refWrapper.current.querySelectorAll('[data-reach-tab]')
    setTabs(Array.from(tabs) as HTMLButtonElement[])
  }, [refWrapper, tabsQty])

  const { indicatorLeft, indicatorWidth, isGoingLeft } = useIndicatorPosition(
    tabs,
    refWrapper,
    containerWidth
  )

  const { animatedRef, coordinates } = useTrackIndicatorPosition()

  return (
    <div ref={refWrapper} className={styles.tabListContainer}>
      <ReactTabList
        {...props}
        ref={ref}
        {...(isHexagon && { 'data-augmented-ui': 'tl-clip br-clip border' })}
      >
        <IndicatorPositionProvider value={{ ...coordinates, isGoingLeft }}>
          {(isHexagon || isUnderline) && (
            <animated.div
              className={styles.indicator}
              style={{
                ...indicatorLeft,
                ...indicatorWidth,
                ...(isUnderline && { bottom: 0, height: 2 })
              }}
              ref={animatedRef}
            />
          )}
          {children}
        </IndicatorPositionProvider>
      </ReactTabList>
    </div>
  )
})
TabList.displayName = 'TabListWrapper'

export default TabList
