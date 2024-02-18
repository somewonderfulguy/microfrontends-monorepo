import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react'
import {
  Tabs as ReachTabs,
  TabsProps as ReachTabsProps,
  TabList as ReactTabList,
  TabListProps as ReactTabListProps,
  Tab as ReachTab,
  TabProps,
  TabPanels as ReachTabPanels,
  TabPanelsProps,
  TabPanel as ReachTabPanel,
  TabPanelProps
} from '@reach/tabs'
import { animated, useSpring } from 'react-spring'

import classNames from 'utils/classNames'
import useResizeObserver from 'hooks/useResizeObserver'
import useMutationObserver from 'hooks/useMutationObserver'

import {
  IndicatorPositionProvider,
  TabsInternalProvider,
  useIndicatorPositionContext,
  useTabsInternalContext
} from './contexts'
import {
  useFadeInOutAnimation,
  useIndicatorPosition,
  useUnderlineAnimation
} from './hooks'

import styles from './styles/Tabs.module.css'
import stylesHexagon from './styles/TabsHexagon.module.css'
import stylesUnderline from './styles/TabsUnderline.module.css'

// horizontal 2, hexagon line
//   + drop down variant (later)
// horizontal 3, folder tabs
// horizontal 4, very shaped
// vertical

// resize screen test
// rtl test (and dynamic change)
// keyboard navigation test
// disabled tab

// animation content (fade in/out; height change)
// dnd tab (reorder; horizontal/vertical)

// TODO: test render props api
// TODO: implement moving indicator using react-spring
// TODO: hexagon replace with with scale ? (performance)
// FIXME: hexagon - text color of active tab on initialization
// TODO: hexagon - focus-visible

export type TabsStyle =
  | 'underline'
  | 'hexagon'
  | 'folder'
  | 'shaped'
  | 'vertical'

type TabsProps = ReachTabsProps &
  HTMLAttributes<HTMLDivElement> & {
    /** Tabs visual style */
    type?: TabsStyle
  }

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ type = 'underline', className, ...props }, ref) => (
    <TabsInternalProvider type={type}>
      <ReachTabs
        {...props}
        className={classNames(
          className,
          type === 'underline' && stylesUnderline.underline,
          type === 'hexagon' && stylesHexagon.hexagon
        )}
        ref={ref}
      />
    </TabsInternalProvider>
  )
)
Tabs.displayName = 'TabsWrapper'

const TabList = forwardRef<
  HTMLDivElement,
  ReactTabListProps & HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const tabsStyle = useTabsInternalContext()
  const isHexagon = tabsStyle === 'hexagon'

  const [tabs, setTabs] = useState<HTMLButtonElement[]>([])

  const [refWrapper, { width: containerWidth }] =
    useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (!refWrapper.current) return
    const tabs = refWrapper.current.querySelectorAll('[data-reach-tab]')
    setTabs(Array.from(tabs) as HTMLButtonElement[])
  }, [refWrapper])

  useUnderlineAnimation(tabs, refWrapper, containerWidth)

  const { indicatorLeft, indicatorWidth, isGoingLeft } = useIndicatorPosition(
    tabs,
    refWrapper,
    containerWidth
  )

  const animatedRef = useRef<HTMLDivElement>(null)
  const [coordinates, setCoordinates] = useState({ left: 0, width: 0 })
  useMutationObserver(
    animatedRef,
    (mutations) => {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style'
        ) {
          const newValue = (mutation.target as HTMLDivElement).getAttribute(
            'style'
          )
          const leftMatch = newValue?.match(/left:\s*([^;]+)/)
          const widthMatch = newValue?.match(/width:\s*([^;]+)/)

          setCoordinates({
            left: leftMatch ? parseFloat(leftMatch[1]) : 0,
            width: widthMatch ? parseFloat(widthMatch[1]) : 0
          })
        }
      })
    },
    {
      attributes: true,
      attributeFilter: ['style']
    }
  )

  return (
    <div ref={refWrapper} className={styles.tabListContainer}>
      <ReactTabList
        {...props}
        ref={ref}
        {...(isHexagon && { 'data-augmented-ui': 'tl-clip br-clip border' })}
      >
        <IndicatorPositionProvider value={{ ...coordinates, isGoingLeft }}>
          {isHexagon && (
            <animated.div
              className={styles.indicator}
              style={{ ...indicatorLeft, ...indicatorWidth }}
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

const Tab = forwardRef<
  HTMLButtonElement,
  TabProps & HTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
  const tabsStyle = useTabsInternalContext()
  const isUnderline = tabsStyle === 'underline'
  const isHexagon = tabsStyle === 'hexagon'

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
    </ReachTab>
  )
})
Tab.displayName = 'TabWrapper'

const TabPanels = forwardRef<
  HTMLDivElement,
  TabPanelsProps & HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const [wrapperRef, { height }] = useResizeObserver<HTMLDivElement>()

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

const TabPanel = forwardRef<
  HTMLDivElement,
  TabPanelProps & HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const divElem = useRef<HTMLDivElement>(null)

  useFadeInOutAnimation(divElem)

  return (
    <ReachTabPanel {...props} ref={ref}>
      <div ref={divElem}>{children}</div>
    </ReachTabPanel>
  )
})
TabPanel.displayName = 'TabPanelWrapper'

const TypedTabs = Tabs as typeof Tabs & {
  TabList: typeof TabList
  Tab: typeof Tab
  TabPanels: typeof TabPanels
  TabPanel: typeof TabPanel
}

TypedTabs.TabList = TabList
TypedTabs.Tab = Tab
TypedTabs.TabPanels = TabPanels
TypedTabs.TabPanel = TabPanel

export default TypedTabs
export * from '@reach/tabs'
export type { TabsProps, TabProps }
export { TypedTabs as Tabs, TabList, Tab, TabPanel, TabPanels }
