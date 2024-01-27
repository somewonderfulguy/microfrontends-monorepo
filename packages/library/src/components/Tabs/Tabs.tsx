import { forwardRef, HTMLAttributes, useEffect, useState } from 'react'
import {
  Tabs as ReachTabs,
  TabsProps as ReachTabsProps,
  TabList as ReactTabList,
  TabListProps as ReactTabListProps,
  Tab as ReachTab,
  TabProps,
  TabPanels,
  TabPanel
} from '@reach/tabs'

import classNames from 'utils/classNames'
import useResizeObserver from 'hooks/useResizeObserver'

import { TabsInternalProvider } from './contexts'
import { underlineAnimation } from './hooks'

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
  ({ type = 'underline', className, ...props }, ref) => {
    return (
      <TabsInternalProvider type={type}>
        <ReachTabs
          {...props}
          className={classNames(className, styles[type])}
          ref={ref}
        />
      </TabsInternalProvider>
    )
  }
)
Tabs.displayName = 'Tabs'

const TabList = forwardRef<
  HTMLDivElement,
  ReactTabListProps & HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const [tabs, setTabs] = useState<HTMLButtonElement[]>([])

  const [refWrapper, { width: containerWidth }] =
    useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (!refWrapper.current) return
    const tabs = refWrapper.current.querySelectorAll('[data-reach-tab]')
    setTabs(Array.from(tabs) as HTMLButtonElement[])
  }, [refWrapper])

  underlineAnimation(tabs, refWrapper, containerWidth)

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

/** Tabs components. Based on headless Reach UI tabs.
 *
 * You can expect the same API as Reach UI tabs. With few additions: `Tabs` component has new `type` prop which allows to change tabs style.
 * You can also use default import and get all sub components using dot notation, e.g. `<Tabs.TabList />`, `<Tabs.Tab />`, etc.
 *
 * Please note that argument table does not contain all props. For full list of props please check Reach UI API.
 *
 * Reach UI API: https://reach.tech/tabs
 *
 * Reach UI NPM: https://www.npmjs.com/package/@reach/tabs
 * */
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
export { TypedTabs as Tabs, TabList, Tab }
