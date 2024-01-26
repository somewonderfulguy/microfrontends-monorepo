import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react'
import {
  Tabs as ReachTabs,
  TabsProps as ReachTabsProps,
  TabList as ReactTabList,
  TabListProps as ReactTabListProps,
  Tab as ReachTab,
  TabProps,
  TabPanels,
  TabPanel,
  useTabsContext
} from '@reach/tabs'

import classNames from 'utils/classNames'
import usePrevious from 'hooks/usePrevious'
import useResizeObserver from 'hooks/useResizeObserver'

import styles from './Tabs.module.css'

// horizontal 1, hexagon line
//   + drop down variant (later)
// horizontal 2, underline
// horizontal 3, folder tabs
// horizontal 4, very shaped
// vertical

// resize screen test
// rtl test
// keyboard navigation test

// animation content (fade in/out; height change)
// disabled tab
// dnd tab (reorder; horizontal/vertical)

type TabsProps = ReachTabsProps &
  HTMLAttributes<HTMLDivElement> & {
    type?: 'underline'
  }

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ type = 'underline', className, ...props }, ref) => {
    return (
      <ReachTabs
        {...props}
        className={classNames(className, styles[type])}
        ref={ref}
      />
    )
  }
)
Tabs.displayName = 'Tabs'

const TabList = forwardRef<
  HTMLDivElement,
  ReactTabListProps & HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { selectedIndex } = useTabsContext() // focusedIndex
  const prevSelectedIndex = usePrevious(selectedIndex) || 0

  const [tabs, setTabs] = useState<HTMLButtonElement[]>([])

  const [refWrapper, { width: containerWidth }] =
    useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (!refWrapper.current) return
    const tabs = refWrapper.current.querySelectorAll('[data-reach-tab]')
    setTabs(Array.from(tabs) as HTMLButtonElement[])
  }, [refWrapper])

  // underline move logic
  useEffect(() => {
    if (!tabs.length || !refWrapper.current) return

    const selectedTab = tabs[selectedIndex]
    const prevSelectedTab = tabs[prevSelectedIndex]

    const isGoingLeft = prevSelectedIndex > selectedIndex

    const { offsetLeft, offsetWidth } = selectedTab
    const { offsetLeft: prevOffsetLeft, offsetWidth: prevOffsetWidth } =
      prevSelectedTab
    const containerWidth = refWrapper.current.offsetWidth

    const width = offsetWidth / containerWidth

    const containerElement = refWrapper.current

    if (isGoingLeft) {
      const transitionWidth = prevOffsetLeft + prevOffsetWidth - offsetLeft

      containerElement.style.setProperty(
        '--_width',
        `${transitionWidth / containerWidth}`
      )
      containerElement.style.setProperty('--_left', `${offsetLeft}px`)

      setTimeout(() => {
        containerElement.style.setProperty('--_width', `${width}`)
      }, 150)
    } else {
      const transitionWidth = offsetLeft + offsetWidth - prevOffsetLeft
      const stretchWidth = transitionWidth / containerWidth

      containerElement.style.setProperty('--_width', `${stretchWidth}`)

      setTimeout(() => {
        containerElement.style.setProperty('--_left', `${offsetLeft}px`)
        containerElement.style.setProperty('--_width', `${width}`)
      }, 150)
    }
    // omitting `prevSelectedIndex` check as it causes multiple useEffect calls and this causes jiggle animation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, tabs, containerWidth])

  return (
    <div ref={refWrapper} style={{ width: 'fit-content' }}>
      <ReactTabList {...props} className={classNames(className)} ref={ref}>
        {children}
      </ReactTabList>
    </div>
  )
})
TabList.displayName = 'TabList'

const Tab = forwardRef<
  HTMLButtonElement,
  TabProps & HTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
  return (
    <ReachTab {...props} ref={ref}>
      <div data-reach-tab-clone>{children}</div>
      <div data-reach-tab-content>{children}</div>
    </ReachTab>
  )
})
Tab.displayName = 'Tab'

/** Accessible tabs */
const TabComponent = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Videos</Tab>
        <Tab>Wallpapers</Tab>
        <Tab>Screenshots</Tab>
        <Tab>Concept arts</Tab>
      </TabList>
      <TabPanels style={{ marginTop: 30 }}>
        <TabPanel>Cyberpunk 2077 tab content</TabPanel>
        <TabPanel>Phantom liberty tab content</TabPanel>
        <TabPanel>Edgerunners tab content</TabPanel>
        <TabPanel>Night city wire tab content</TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default TabComponent

type AddedComponents = {
  TabList: typeof TabList
  Tab: typeof Tab
  TabPanels: typeof TabPanels
  TabPanel: typeof TabPanel
}
/** Extending type of component, so sub components could be assigned and used this way: `<Tabs.TabList>...</Tabs.TabList>` */
const TypedTabs = Tabs as typeof Tabs & AddedComponents

TypedTabs.TabList = TabList
TypedTabs.Tab = Tab
TypedTabs.TabPanels = TabPanels
TypedTabs.TabPanel = TabPanel

// export default TypedTabs
export * from '@reach/tabs'
export type { TabsProps, TabProps }
export { TypedTabs as Tabs, Tab }
