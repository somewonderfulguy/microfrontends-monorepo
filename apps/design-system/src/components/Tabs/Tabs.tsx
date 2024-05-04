import { forwardRef, HTMLAttributes, useEffect, useRef } from 'react'
import {
  Tabs as ReachTabs,
  TabsProps as ReachTabsProps,
  TabProps
} from '@reach/tabs'

import classNames from '@repo/shared/utils/classNames'

import {
  TabsInternalProvider,
  useTabsInternalValue,
  useTabsInternalDispatch
} from './contexts'
import TabList from './TabList'
import Tab from './Tab'
import TabPanels from './TabPanels'
import TabPanel from './TabPanel'

import stylesFolder from './styles/TabsFolder.module.css'
import stylesHexagon from './styles/TabsHexagon.module.css'
import stylesShaped from './styles/TabsShaped.module.css'
import stylesUnderline from './styles/TabsUnderline.module.css'
import stylesVertical from './styles/TabsVertical.module.css'

// horizontal 2, hexagon line
//   + drop down variant (later)
// horizontal 3, folder tabs
// horizontal 4, very shaped

// resize screen test
// rtl test (and dynamic change)
// keyboard navigation test
// disabled tab

// animation content (fade in/out; height change)
// dnd tab (reorder; horizontal/vertical)

// FIXME: hexagon - text color of active tab on initialization
// TODO: test render props api
// TODO: go through each css file and make sure variables are user correctly
// TODO: add .cyberpunk-ui-theme-white-on-black on Tabs root component and prop to change it
// TODO: create story with dynamic tabs (add/remove/rename) to test that animation logic does not break
// TODO: create story with drag and drop tabs to test that animation logic does not break
// TODO: render empty space for scrollbar (Chrome, Vertical tabs story in docs view)
// TODO: reduce file size - move logic to separate hooks

export type TabsStyle =
  | 'folder'
  | 'hexagon'
  | 'shaped'
  | 'underline'
  | 'vertical'

// Directly extend ReachTabsProps and HTMLAttributes<HTMLDivElement> with a conditional prop structure.
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
  const dispatch = useTabsInternalDispatch()
  const ref = useRef<HTMLDivElement>(null)

  const direction = ref.current && getDirection(ref.current as Element)
  useEffect(() => {
    dispatch({ isRtl: direction === 'rtl' })
  }, [direction, dispatch])

  return <div ref={ref} aria-hidden />
}

const isWithAnimateOnHoverTabsProps = (
  props: TabsProps
): props is TabsProps & { animateOnHover?: boolean } =>
  props.type === undefined ||
  props.type === 'underline' ||
  props.type === 'hexagon'

const TabsWrapper = forwardRef<HTMLDivElement, TabsProps>((props, ref) => (
  <TabsInternalProvider>
    <Tabs {...props} ref={ref} />
  </TabsInternalProvider>
))
TabsWrapper.displayName = 'TabsContextWrapper'

const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const animateOnHover = isWithAnimateOnHoverTabsProps(props)
    ? props.animateOnHover ?? false
    : false

  const dispatch = useTabsInternalDispatch()

  const { type, children, className, ...restProps } = props

  useEffect(() => dispatch({ type }), [dispatch, type])
  useEffect(() => dispatch({ animateOnHover }), [dispatch, animateOnHover])

  const isRtl = useTabsInternalValue((state) => state.isRtl)

  return (
    <ReachTabs
      {...(isRtl && { dir: 'rtl' })}
      {...(type === 'vertical' && { orientation: 'vertical' })}
      {...restProps}
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
      <DirectionDetector />
    </ReachTabs>
  )
})
Tabs.displayName = 'TabsWrapper'

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
// eslint-disable-next-line react-refresh/only-export-components
export * from '@reach/tabs'
export type { TabsProps, TabProps }
export { TypedTabs as Tabs, TabList, Tab, TabPanel, TabPanels }
