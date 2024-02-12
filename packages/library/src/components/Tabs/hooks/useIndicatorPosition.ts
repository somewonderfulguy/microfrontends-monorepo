import { RefObject, useLayoutEffect, useRef } from 'react'
import { useTabsContext } from '@reach/tabs'
import { useSpring } from 'react-spring'

import usePrevious from 'hooks/usePrevious'

import { useTabsInternalContext } from '../contexts'

const getDirection = (element: Element) =>
  window.getComputedStyle(element).getPropertyValue('direction')

export const useIndicatorPosition = (
  tabs: HTMLButtonElement[],
  refWrapper: RefObject<HTMLDivElement>,
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

  // TODO: play with config (mass / tension / friction or just duration; also timeout duration)

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

    const selectedTab = tabs[selectedIndex]

    const performTransition = (prevIndex: number, nextIndex: number) => {
      const isGoingLeft = isRtl ? prevIndex < nextIndex : prevIndex > nextIndex

      const nextTab = tabs[nextIndex]
      const prevTab = tabs[prevIndex]

      const { offsetLeft: newOffsetLeft, offsetWidth: newOffsetWidth } = nextTab
      const { offsetLeft: prevOffsetLeft, offsetWidth: prevOffsetWidth } =
        prevTab

      if (isGoingLeft) {
        leftApi.start({ left: newOffsetLeft })
        widthApi.start({
          width: prevOffsetLeft + prevOffsetWidth - newOffsetLeft
        })
        setTimeout(() => {
          widthApi.start({ width: newOffsetWidth })

          // duplication required to fix frozen 'left' value
          leftApi.start({ left: newOffsetLeft })
        }, 200)
      } else {
        widthApi.start({
          width: newOffsetLeft - prevOffsetLeft + newOffsetWidth
        })
        setTimeout(() => {
          widthApi.start({ width: newOffsetWidth })
          leftApi.start({ left: newOffsetLeft })
        }, 200)
      }
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
