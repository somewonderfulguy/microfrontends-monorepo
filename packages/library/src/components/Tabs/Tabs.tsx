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
  TabPanelProps,
  useTabsContext
} from '@reach/tabs'
import { animated, useSpring } from 'react-spring'

import classNames from 'utils/classNames'
import useResizeObserver from 'hooks/useResizeObserver'

import {
  IndicatorPositionProvider,
  TabsInternalProvider,
  useIndicatorPositionContext,
  useTabsInternalContext
} from './contexts'
import {
  useFadeInOutAnimation,
  useIndicatorPosition,
  useTrackIndicatorPosition
} from './hooks'

import styles from './styles/Tabs.module.css'
import stylesFolder from './styles/TabsFolder.module.css'
import stylesHexagon from './styles/TabsHexagon.module.css'
import stylesShaped from './styles/TabsShaped.module.css'
import stylesUnderline from './styles/TabsUnderline.module.css'
import stylesVertical from './styles/TabsVertical.module.css'

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
// TODO: implement animation flag - on hover or on click/keyboard/external change
// FIXME: hexagon - text color of active tab on initialization
// TODO: hexagon & underline - optional animation on hover
// TODO: reduce file size - move logic to separate hooks
// TODO: go through each css file and make sure variables are user correctly
// TODO: add .cyberpunk-ui-theme-white-on-black on Tabs root component and prop to change it
// TODO: create story with dynamic tabs (add/remove/rename) to test that animation logic does not break
// TODO: create story with drag and drop tabs to test that animation logic does not break
// TODO: render empty space for scrollbar (Chrome, Vertical tabs story in docs view)
// TODO: split this file into multiple files ?
// TODO: replace react context with either zustand or jotai

export type TabsStyle =
  | 'folder'
  | 'hexagon'
  | 'shaped'
  | 'underline'
  | 'vertical'

// Here we directly extend ReachTabsProps and HTMLAttributes<HTMLDivElement>
// with a conditional prop structure.
type TabsProps = ReachTabsProps &
  HTMLAttributes<HTMLDivElement> &
  (
    | {
        /** Tabs visual style */
        type: 'underline' | 'hexagon'
        /** Animation type: click or hover */
        animateOnHover?: boolean
      }
    | {
        /** Tabs visual style */
        type?: Exclude<TabsStyle, 'underline' | 'hexagon'>
      }
  )

const getDirection = (element: Element) =>
  window.getComputedStyle(element).getPropertyValue('direction')

const DirectionDetector = () => {
  const { setIsRtl } = useTabsInternalContext()
  const ref = useRef<HTMLDivElement>(null)

  const direction = ref.current && getDirection(ref.current as Element)
  useEffect(() => {
    setIsRtl(direction === 'rtl')
  }, [direction, setIsRtl])

  return <div ref={ref} aria-hidden />
}

function isWithAnimateOnHoverTabsProps(
  props: TabsProps
): props is TabsProps & { animateOnHover?: boolean } {
  return (
    props.type === undefined ||
    props.type === 'underline' ||
    props.type === 'hexagon'
  )
}

const TabsWrapper = forwardRef<HTMLDivElement, TabsProps>(
  ({ type = 'underline', ...props }, ref) => {
    const animateOnHover = isWithAnimateOnHoverTabsProps(props)
      ? props.animateOnHover ?? false
      : false
    return (
      <TabsInternalProvider type={type} animateOnHover={animateOnHover}>
        <Tabs {...props} ref={ref} />
      </TabsInternalProvider>
    )
  }
)
TabsWrapper.displayName = 'TabsContextWrapper'

const Tabs = forwardRef<
  HTMLDivElement,
  ReachTabsProps & HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { type, isRtl } = useTabsInternalContext()
  return (
    <ReachTabs
      {...(isRtl && { dir: 'rtl' })}
      {...(type === 'vertical' && { orientation: 'vertical' })}
      {...props}
      className={classNames(
        className,
        type === 'folder' && stylesFolder.folder,
        type === 'hexagon' && stylesHexagon.hexagon,
        type === 'shaped' && stylesShaped.shaped,
        type === 'underline' && stylesUnderline.underline,
        type === 'vertical' && stylesVertical.vertical
      )}
      ref={ref}
    >
      {children}
      <DirectionDetector />
    </ReachTabs>
  )
})
Tabs.displayName = 'TabsWrapper'

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

const TypedTabs = TabsWrapper as typeof TabsWrapper & {
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
