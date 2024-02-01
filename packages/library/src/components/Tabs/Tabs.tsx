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

import classNames from 'utils/classNames'
import useResizeObserver from 'hooks/useResizeObserver'

import { TabsInternalProvider } from './contexts'
import {
  useContentHeightAnimation,
  useFadeInOutAnimation,
  useUnderlineAnimation
} from './hooks'

import styles from './Tabs.module.css'

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
        className={classNames(className, styles[type])}
        ref={ref}
      />
    </TabsInternalProvider>
  )
)
Tabs.displayName = 'TabsWrapper'

const TabList = forwardRef<
  HTMLDivElement,
  ReactTabListProps & HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const [tabs, setTabs] = useState<HTMLButtonElement[]>([])

  const [refWrapper, { width: containerWidth }] =
    useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (!refWrapper.current) return
    const tabs = refWrapper.current.querySelectorAll('[data-reach-tab]')
    setTabs(Array.from(tabs) as HTMLButtonElement[])
  }, [refWrapper])

  useUnderlineAnimation(tabs, refWrapper, containerWidth)

  return (
    <div ref={refWrapper} className={styles.tabListContainer}>
      <ReactTabList {...props} ref={ref} />
    </div>
  )
})
TabList.displayName = 'TabListWrapper'

const Tab = forwardRef<
  HTMLButtonElement,
  TabProps & HTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <ReachTab {...props} ref={ref}>
    <div data-reach-tab-clone>{children}</div>
    <div data-reach-tab-content>{children}</div>
  </ReachTab>
))
Tab.displayName = 'TabWrapper'

const TabPanels = forwardRef<
  HTMLDivElement,
  TabPanelsProps & HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useContentHeightAnimation(wrapperRef)

  return (
    <div ref={wrapperRef}>
      <ReachTabPanels {...props} ref={ref} />
    </div>
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
