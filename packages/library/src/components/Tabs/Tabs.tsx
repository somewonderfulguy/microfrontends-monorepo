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
import usePrevious from 'hooks/usePrevious'

import { TabsInternalProvider } from './contexts'
import { useUnderlineAnimation } from './hooks'

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
  const { selectedIndex } = useTabsContext()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current) return
    const panelsElement = wrapperRef.current.querySelector(
      '[data-reach-tab-panels]'
    ) as HTMLDivElement
    const selectedPanel = wrapperRef.current.querySelector(
      '[data-reach-tab-panel]:not([hidden]) > div'
    ) as HTMLDivElement
    if (!selectedPanel) return console.warn('Selected panel not found')
    if (!panelsElement) return console.warn('Panels element not found')

    const panelHeight = selectedPanel.offsetHeight
    panelsElement.style.setProperty('--panel-height', `${panelHeight}px`)
  }, [selectedIndex])

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
