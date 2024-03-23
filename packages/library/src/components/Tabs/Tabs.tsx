import { forwardRef, HTMLAttributes, useEffect, useRef } from 'react'
import {
  Tabs as ReachTabs,
  TabsProps as ReachTabsProps,
  TabProps,
  TabPanels as ReachTabPanels,
  TabPanelsProps,
  TabPanel as ReachTabPanel,
  TabPanelProps
} from '@reach/tabs'
import { animated, useSpring } from 'react-spring'

import classNames from 'utils/classNames'
import useResizeObserver from 'hooks/useResizeObserver'

import { TabsInternalProvider, useTabsInternalContext } from './contexts'
import { useFadeInOutAnimation } from './hooks'
import TabList from './TabList'
import Tab from './Tab'

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

// FIXME: hexagon - text color of active tab on initialization
// FIXME: hexagon - non-hover animation on active tab (text visual bug)
// TODO: test render props api
// TODO: go through each css file and make sure variables are user correctly
// TODO: add .cyberpunk-ui-theme-white-on-black on Tabs root component and prop to change it
// TODO: create story with dynamic tabs (add/remove/rename) to test that animation logic does not break
// TODO: create story with drag and drop tabs to test that animation logic does not break
// TODO: render empty space for scrollbar (Chrome, Vertical tabs story in docs view)
// TODO: better state management - either improved fast context or zustand or jotai
// TODO: reduce file size - move logic to separate hooks
// TODO: split this file into multiple files

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
  const { type, isRtl, animateOnHover } = useTabsInternalContext()
  return (
    <ReachTabs
      {...(isRtl && { dir: 'rtl' })}
      {...(type === 'vertical' && { orientation: 'vertical' })}
      {...props}
      className={classNames(
        className,
        type === 'folder' && stylesFolder.folder,
        type === 'hexagon' &&
          (animateOnHover
            ? stylesHexagon.hexagon
            : stylesHexagon.hexagonStatic),
        type === 'shaped' && stylesShaped.shaped,
        type === 'underline' && stylesUnderline.underline,
        type === 'vertical' && stylesVertical.vertical
      )}
      ref={ref}
    >
      {children}
      {/* TODO: move to TabList? */}
      <DirectionDetector />
    </ReachTabs>
  )
})
Tabs.displayName = 'TabsWrapper'

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
