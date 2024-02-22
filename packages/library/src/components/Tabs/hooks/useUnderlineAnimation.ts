import { RefObject, useLayoutEffect, useRef } from 'react'
import { useTabsContext } from '@reach/tabs'

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
  const { offsetLeft: _offsetLeft, offsetWidth } = tab
  const offsetLeft =
    // -1px to fix horizontal scroll in Chrome/Edge
    _offsetLeft + (isVeryLeft ? 0 : sidePadding) - 1

  const tabScale =
    (offsetWidth -
      (isVeryLeft || isVeryRight ? sidePadding : sidePadding * 2)) /
    containerWidth

  return { offsetLeft, tabScale }
}

// FIXME: hover on active tab - start navigation using keyboard, see the bug (not getting back to active tab)

export const useUnderlineAnimation = (
  tabs: HTMLButtonElement[],
  refWrapper: RefObject<HTMLDivElement>,
  containerWidth: number
) => {
  const { selectedIndex } = useTabsContext()
  const prevSelectedIndex = usePrevious(selectedIndex) || 0

  const { type: tabsStyle } = useTabsInternalContext()
  const isUnderline = tabsStyle === 'underline'

  const isRtl = refWrapper.current
    ? getDirection(refWrapper.current) === 'rtl'
    : false

  // underline animation & position logic (mouse hover)
  const isInit = useRef(true)
  const hoverIndex = useRef(-1)
  const prevContainerWidth = usePrevious(containerWidth)
  useLayoutEffect(() => {
    if (!isUnderline || !tabs.length || !refWrapper.current || !containerWidth)
      return

    const tabListElement = refWrapper.current.querySelector(
      '[data-reach-tab-list]'
    ) as HTMLDivElement

    if (!tabListElement) {
      throw new Error('tabListElement not found')
    }

    const sidePaddingStr = getComputedStyle(tabListElement).getPropertyValue(
      '--_tab-side-padding'
    )

    if (!sidePaddingStr) {
      throw new Error('--_tab-side-padding css variable not found')
    }
    if (!sidePaddingStr.includes('px')) {
      throw new Error('--_tab-side-padding css variable must be in px unit')
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
    const setLeft = (left: number) =>
      containerElement.style.setProperty('--_left', `${left}px`)
    const setScale = (scale: number) =>
      containerElement.style.setProperty('--_width', `${scale}`)

    // initialization; need to compare with previous containerWidth due to Chrome/Edge wrong offset on initial render
    if (isInit.current || containerWidth !== prevContainerWidth) {
      isInit.current = false

      const { offsetLeft, tabScale } = getTabData(
        selectedTab,
        defaultGetterOptions
      )

      setLeft(offsetLeft)
      setScale(tabScale)
    }

    const performTransition = (prevIndex: number, nextIndex: number) => {
      const isGoingLeft = isRtl ? prevIndex < nextIndex : prevIndex > nextIndex

      const prevTab = tabs[prevIndex]
      const nextTab = tabs[nextIndex]

      const { offsetLeft: prevOffsetLeft, offsetWidth: prevOffsetWidth } =
        prevTab
      const { offsetLeft, offsetWidth: nextOffsetWidth } = nextTab
      const nextOffsetLeft =
        // -1px to fix horizontal scroll in Chrome/Edge
        offsetLeft + (nextIndex === 0 ? 0 : sidePadding) - 1

      const isExtremeElement = nextIndex === 0 || nextIndex + 1 === tabs.length
      const reduceWidth = isExtremeElement ? sidePadding : sidePadding * 2
      const nextTabScale = (nextOffsetWidth - reduceWidth) / containerWidth

      if (isGoingLeft) {
        const transitionWidth =
          prevOffsetLeft +
          prevOffsetWidth -
          nextOffsetLeft -
          (prevIndex === tabs.length - 1 ? 0 : sidePadding) -
          1
        const stretchScale = transitionWidth / containerWidth
        setScale(stretchScale)

        setLeft(nextOffsetLeft)
        setTimeout(() => {
          setScale(nextTabScale)
          // need to duplicate this, it fixes wrong position if navigate super fast
          setLeft(nextOffsetLeft)
        }, 150)
      } else {
        const transitionWidth =
          (prevIndex === 0 ? nextOffsetLeft : offsetLeft) +
          (nextOffsetWidth - reduceWidth) -
          prevOffsetLeft
        const stretchScale = transitionWidth / containerWidth

        setScale(stretchScale)

        // this weird timeout difference needed to fix Chrome/Edge jiggle on moving right
        setTimeout(() => setLeft(nextOffsetLeft), 140)
        setTimeout(() => setScale(nextTabScale), 150)
      }
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
    prevSelectedIndex
  ])
}
