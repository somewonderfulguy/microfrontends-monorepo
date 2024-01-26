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

import styles from './Tabs.module.css'
import usePrevious from 'hooks/usePrevious'

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
  const prevSelectedIndex = usePrevious(selectedIndex)
  const isGoingLeft = (prevSelectedIndex || 0) > selectedIndex

  const [tabs, setTabs] = useState<HTMLButtonElement[]>([])

  const refWrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!refWrapper.current) return
    const tabs = refWrapper.current.querySelectorAll('[data-reach-tab]')
    setTabs(Array.from(tabs) as HTMLButtonElement[])
  }, [])

  // useResizeObserver

  // underline move logic
  useEffect(() => {
    if (!tabs.length || !refWrapper.current) return

    const selectedTab = tabs[selectedIndex]
    const isOutermostTab =
      selectedIndex === 0 || selectedIndex === tabs.length - 1
    const { offsetLeft, offsetWidth } = selectedTab
    const containerWidth = refWrapper.current.offsetWidth

    const scale = offsetWidth / containerWidth + (isOutermostTab ? 0 : 0.01)
    const left = offsetLeft - (isOutermostTab ? 0 : 4)
    refWrapper.current.style.setProperty('--_left', `${left}px`)
    refWrapper.current.style.setProperty('--_width', `${scale}`)
  }, [selectedIndex, tabs, isGoingLeft])

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
        <Tab>Music</Tab>
      </TabList>
      <TabPanels style={{ marginTop: 30 }}>
        <TabPanel>Cyberpunk 2077 tab content</TabPanel>
        <TabPanel>Phantom liberty tab content</TabPanel>
        <TabPanel>Edgerunners tab content</TabPanel>
        <TabPanel>Night city wire tab content</TabPanel>
        <TabPanel>Music tab content</TabPanel>
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
