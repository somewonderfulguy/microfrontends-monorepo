import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react'
import {
  Tabs as ReachTabs,
  TabsProps as ReachTabsProps,
  TabList as ReactTabList,
  TabListProps as ReactTabListProps,
  Tab as ReachTab,
  TabProps,
  TabPanels,
  TabPanel as ReachTabPanel,
  TabPanelProps as ReachTabPanelProps,
  useTabsContext
} from '@reach/tabs'

import classNames from 'utils/classNames'
import useResizeObserver from 'hooks/useResizeObserver'
import usePrevious from 'hooks/usePrevious'

import { TabsInternalProvider } from './contexts'
import { useUnderlineAnimation } from './hooks'

import styles from './Tabs.module.css'

// horizontal 1, underline
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
>(({ children, className, ...props }, ref) => {
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
      <ReactTabList {...props} className={classNames(className)} ref={ref}>
        {children}
      </ReactTabList>
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

const TabPanel = forwardRef<
  HTMLDivElement,
  ReachTabPanelProps & HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const divElem = useRef<HTMLDivElement>(null)

  const { selectedIndex } = useTabsContext()
  const prevSelectedIndex = usePrevious(selectedIndex) || 0

  const [index, setIndex] = useState<number | null>(null)

  // find index of tab panel
  useEffect(() => {
    if (!divElem.current) return

    const parent = divElem.current.parentElement?.parentElement

    if (!parent) return

    const childElements = Array.from(parent.children)

    const index = childElements.findIndex((child) => {
      const subChild = child.querySelector('&> div')
      return subChild === divElem.current
    })

    setIndex(index)
  }, [])

  // fade in/out animation js logic
  useEffect(() => {
    const panelElem = divElem.current?.parentElement
    if (!panelElem || prevSelectedIndex === selectedIndex) return

    if (index === prevSelectedIndex) {
      panelElem.removeAttribute('opening')
      panelElem.setAttribute('closing', '')
      panelElem.addEventListener(
        'animationend',
        () => {
          panelElem.removeAttribute('closing')
          panelElem.setAttribute('closed', '')
        },
        { once: true }
      )
    } else if (index === selectedIndex) {
      panelElem.setAttribute('opening', '')
      panelElem.removeAttribute('closed')
      panelElem.addEventListener(
        'animationend',
        () => {
          panelElem.removeAttribute('opening')
        },
        { once: true }
      )
    }
  }, [selectedIndex, prevSelectedIndex, index])

  return (
    <ReachTabPanel {...props} ref={ref}>
      <div ref={divElem}>{children}</div>
    </ReachTabPanel>
  )
})
TabPanel.displayName = 'TabPanelWrapper'

/** Tabs components. Based on headless Reach UI tabs (see links below).
 *
 * You can expect the same API as Reach UI tabs. With few additions: `<Tabs />` component has new `type` prop which allows to change tabs style.
 * You can also use default import and get all sub components using dot notation, e.g. `<Tabs.TabList />`, `<Tabs.Tab />`, etc.
 *
 * Please note that argument table does not contain all props. For full list of props please check Reach UI API.
 *
 * Supported features:
 * - Mobile view. If tabs are too wide to fit on screen, they will be scrollable.
 * - RTL - animations and styles are mirrored.
 *
 * Links:
 * - Reach UI API: https://reach.tech/tabs
 * - Reach UI NPM: https://www.npmjs.com/package/@reach/tabs
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
export { TypedTabs as Tabs, TabList, Tab, TabPanel }
