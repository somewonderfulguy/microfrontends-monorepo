import { RefObject, useLayoutEffect, useRef } from 'react'
import { useTabsContext } from '@reach/tabs'
import { useSpring } from 'react-spring'

import usePrevious from '@repo/shared/hooks/usePrevious'

import { useTabsInternalValue } from '../contexts/tabsInternalContext'
import { useIndicatorPositionDispatch } from '../contexts'

export const useIndicatorPosition = (
  tabs: HTMLButtonElement[],
  refWrapper: RefObject<HTMLDivElement>,
  containerWidth: number
) => {
  const { selectedIndex } = useTabsContext()
  const prevSelectedIndex = usePrevious(selectedIndex) || 0
  const dispatchIndicatorPosition = useIndicatorPositionDispatch()

  const animateOnHover = useTabsInternalValue((state) => state.animateOnHover)
  const isRtl = useTabsInternalValue((state) => state.isRtl)
  const tabsStyle = useTabsInternalValue((state) => state.type)
  const isUnderline = tabsStyle === 'underline'
  const isHexagon = tabsStyle === 'hexagon'

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
    if (
      !(isHexagon || isUnderline) ||
      !tabs.length ||
      !refWrapper.current ||
      !containerWidth
    )
      return

    const tabListElement = refWrapper.current.querySelector(
      '[data-reach-tab-list]'
    ) as HTMLDivElement

    if (!tabListElement) {
      throw new Error('tabListElement not found')
    }

    const selectedTab = tabs[selectedIndex]

    const performTransition = (prevIndex: number, nextIndex: number) => {
      const isGoingLeft = isRtl ? prevIndex < nextIndex : prevIndex > nextIndex
      dispatchIndicatorPosition({ isGoingLeft })

      const nextTab = tabs[nextIndex]
      const prevTab = tabs[prevIndex]

      const { offsetLeft: _newOffsetLeft, offsetWidth: newOffsetWidth } =
        nextTab
      const { offsetLeft: _prevOffsetLeft, offsetWidth: prevOffsetWidth } =
        prevTab

      const newPaddingLeft = parseFloat(getComputedStyle(nextTab).paddingLeft)
      const newPaddingRight = parseFloat(getComputedStyle(nextTab).paddingRight)
      const prevPaddingLeft = parseFloat(getComputedStyle(prevTab).paddingLeft)
      const prevPaddingRight = parseFloat(
        getComputedStyle(prevTab).paddingRight
      )

      const newWidth = isUnderline
        ? newOffsetWidth - newPaddingLeft - newPaddingRight
        : newOffsetWidth

      const newOffsetLeft = isUnderline
        ? _newOffsetLeft + newPaddingLeft
        : _newOffsetLeft

      const prevWidth = isUnderline
        ? prevOffsetWidth - prevPaddingLeft - prevPaddingRight
        : prevOffsetWidth

      const prevOffsetLeft = isUnderline
        ? _prevOffsetLeft + prevPaddingLeft
        : _prevOffsetLeft

      if (isGoingLeft) {
        leftApi.start({ left: newOffsetLeft })
        widthApi.start({
          width: prevOffsetLeft + prevWidth - newOffsetLeft
        })
        setTimeout(() => {
          widthApi.start({ width: newWidth })

          // duplication required to fix frozen 'left' value
          leftApi.start({ left: newOffsetLeft })
        }, 200)
      } else {
        widthApi.start({
          width: newOffsetLeft - prevOffsetLeft + newWidth
        })
        setTimeout(() => {
          widthApi.start({ width: newWidth })
          leftApi.start({ left: newOffsetLeft })
        }, 200)
      }
    }

    // initialization; need to compare with previous containerWidth due to Chrome/Edge wrong offset on initial render
    if (isInit.current || containerWidth !== prevContainerWidth) {
      isInit.current = false

      const { offsetLeft, offsetWidth } = selectedTab

      const paddingLeft = parseFloat(getComputedStyle(selectedTab).paddingLeft)
      const paddingRight = parseFloat(
        getComputedStyle(selectedTab).paddingRight
      )

      leftApi.start({
        immediate: true,
        left: offsetLeft + (isHexagon ? 0 : paddingLeft)
      })
      widthApi.start({
        immediate: true,
        width: offsetWidth - (isHexagon ? 0 : paddingLeft + paddingRight)
      })
    }

    // active tab (selectedIndex) change logic - via keyboard / click / external
    if (selectedIndex !== prevSelectedIndex) {
      // if hover & selected index are the same, no need to perform transition
      if (hoverIndex.current !== selectedIndex) {
        performTransition(prevSelectedIndex, selectedIndex)
      }
    }

    if (!animateOnHover) return

    // mouse hover logic
    let prevHoverIndex = selectedIndex
    const mouseEnterCallbacks = tabs.map((_hoverTab, _hoverIndex) => () => {
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
    widthApi,
    animateOnHover,
    dispatchIndicatorPosition
  ])

  return {
    indicatorLeft,
    indicatorWidth
  }
}
