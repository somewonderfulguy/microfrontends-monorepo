import { RefObject, useLayoutEffect, useRef } from 'react'
import { useTabsContext } from '@reach/tabs'
import { useSpring } from 'react-spring'

import usePrevious from 'hooks/usePrevious'

import { useTabsInternalContext } from '../contexts'

const getDirection = (element: Element) =>
  window.getComputedStyle(element).getPropertyValue('direction')

type TabGetterOptions = {
  isVeryLeft?: boolean
  isVeryRight?: boolean
  sidePadding: number
  containerWidth: number
}
const getTabData = (
  tab: HTMLButtonElement,
  {
    isVeryLeft = false,
    isVeryRight = false,
    sidePadding,
    containerWidth
  }: TabGetterOptions
) => {
  const { offsetLeft, offsetWidth } = tab

  return { offsetLeft, offsetWidth }
}

export const useIndicatorPosition = (
  tabs: HTMLButtonElement[],
  refWrapper: RefObject<HTMLDivElement>,
  indicatorElement: RefObject<HTMLDivElement>,
  containerWidth: number
) => {
  const { selectedIndex } = useTabsContext()
  const prevSelectedIndex = usePrevious(selectedIndex) || 0

  const tabsStyle = useTabsInternalContext()
  const isUnderline = tabsStyle === 'underline'
  const isHexagon = tabsStyle === 'hexagon'

  const isRtl = refWrapper.current
    ? getDirection(refWrapper.current) === 'rtl'
    : false

  // underline animation & position logic (mouse hover)
  const isInit = useRef(true)
  const hoverIndex = useRef(-1)
  const prevContainerWidth = usePrevious(containerWidth)

  // TODO: useSprings

  const [indicatorLeft, leftApi] = useSpring(
    () => ({
      from: { left: 0 },
      to: { left: 0 }
    }),
    []
  )

  const [indicatorWidth, widthApi] = useSpring(
    () => ({
      from: { width: 0 },
      to: { width: 0 }
    }),
    []
  )

  // 1. copy logic from useUnderlineAnimation (empty function performTransition)
  // 2. going right stretch
  // 3. going right left position
  // 4. going left shrink
  // 5. calibrate timings
  // 6. going left - copy all and do in reverse

  useLayoutEffect(() => {
    if (!isHexagon || !tabs.length || !refWrapper.current || !containerWidth)
      return

    const tabListElement = refWrapper.current.querySelector(
      '[data-reach-tab-list]'
    ) as HTMLDivElement

    if (!tabListElement) {
      throw new Error('tabListElement not found')
    }

    const sidePaddingStr =
      getComputedStyle(tabListElement).getPropertyValue('--tab-side-padding')

    if (!sidePaddingStr) {
      throw new Error('--tab-side-padding css variable not found')
    }
    if (!sidePaddingStr.includes('px')) {
      throw new Error('--tab-side-padding css variable must be in px unit')
    }

    const sidePadding = Number(sidePaddingStr.replace('px', ''))

    const defaultGetterOptions: TabGetterOptions = {
      containerWidth,
      sidePadding,
      isVeryLeft: selectedIndex === 0,
      isVeryRight: selectedIndex + 1 === tabs.length
    }

    const selectedTab = tabs[selectedIndex]

    const containerElement = refWrapper.current

    const performTransition = (prevIndex: number, nextIndex: number) => {
      const isGoingLeft = isRtl ? prevIndex < nextIndex : prevIndex > nextIndex
      console.log('performTransition', prevIndex, nextIndex)

      const nextTab = tabs[nextIndex]
      const { offsetLeft, offsetWidth } = nextTab

      leftApi.start({ left: offsetLeft })
      widthApi.start({ width: offsetWidth })
    }

    // initialization; need to compare with previous containerWidth due to Chrome/Edge wrong offset on initial render
    if (isInit.current || containerWidth !== prevContainerWidth) {
      isInit.current = false

      const { offsetLeft, offsetWidth } = selectedTab

      leftApi.start({ immediate: true, left: offsetLeft })
      widthApi.start({ immediate: true, width: offsetWidth })
    }

    // active tab (selectedIndex) change logic - via keyboard / click / external
    if (selectedIndex !== prevSelectedIndex) {
      // if hover & selected index are the same, no need to perform transition
      if (hoverIndex.current !== selectedIndex) {
        performTransition(prevSelectedIndex, selectedIndex)
        // animate left
        // animate width
      }
    }

    // mouse hover logic
    let prevHoverIndex = selectedIndex
    const mouseEnterCallbacks = tabs.map((hoverTab, _hoverIndex) => () => {
      hoverIndex.current = _hoverIndex
      if (prevHoverIndex === _hoverIndex) return
      performTransition(prevHoverIndex, _hoverIndex)
      prevHoverIndex = _hoverIndex
    })
    const mouseLeaveCallbacks = tabs.map(
      (leaveTab, leaveIndex) => (event: MouseEvent) => {
        const toElement = event.relatedTarget as HTMLElement

        // check is leaving towards another tab
        const isSomeTab = tabs.some((tab) => tab.contains(toElement))

        // if leaving all the tabs, reset to active tab
        if (!isSomeTab) {
          if (leaveIndex !== selectedIndex && leaveTab !== toElement) {
            performTransition(leaveIndex, selectedIndex)
            prevHoverIndex = selectedIndex
          }
          hoverIndex.current = -1
        }
      }
    )

    tabs.forEach((tab, hoverIndex) => {
      tab.addEventListener('mouseout', mouseLeaveCallbacks[hoverIndex])
      tab.addEventListener('mouseover', mouseEnterCallbacks[hoverIndex])
    })

    return () => {
      tabs.forEach((tab, hoverIndex) => {
        tab.removeEventListener('mouseout', mouseLeaveCallbacks[hoverIndex])
        tab.removeEventListener('mouseover', mouseEnterCallbacks[hoverIndex])
      })
    }
  }, [
    tabs,
    selectedIndex,
    isUnderline,
    refWrapper,
    isRtl,
    containerWidth,
    prevContainerWidth,
    prevSelectedIndex,
    isHexagon,
    leftApi,
    widthApi
  ])

  return {
    indicatorLeft,
    indicatorWidth
  }
}
