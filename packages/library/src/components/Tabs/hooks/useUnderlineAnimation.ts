import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

export const useUnderlineAnimation = (
  tabs: HTMLButtonElement[],
  refWrapper: RefObject<HTMLDivElement>,
  containerWidth: number
) => {
  const { selectedIndex } = useTabsContext()
  const prevSelectedIndex = usePrevious(selectedIndex) || 0

  const tabsStyle = useTabsInternalContext()
  const isUnderline = tabsStyle === 'underline'

  const isRtl = refWrapper.current
    ? getDirection(refWrapper.current) === 'rtl'
    : false

  // underline animation & position logic (mouse hover)
  const isInit = useRef(true)
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

    // It is basically "from" tab
    const selectedTab = tabs[selectedIndex]
    const { offsetLeft, offsetWidth } = selectedTab
    const selectedTabOffsetLeft =
      // -1px to fix horizontal scroll in Chrome/Edge
      offsetLeft + (selectedIndex === 0 ? 0 : sidePadding) - 1

    const selectedTabWidth =
      (offsetWidth -
        (selectedIndex === 0 || selectedIndex + 1 === tabs.length
          ? sidePadding
          : sidePadding * 2)) /
      containerWidth

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

    // active tab (selectedIndex) change logic
    if (selectedIndex !== prevSelectedIndex) {
      // eslint-disable-next-line no-console
      console.log('time to change', selectedIndex, prevSelectedIndex)
    }

    // mouse hover logic
    let prevHoverIndex = selectedIndex
    const mouseEnterCallbacks = tabs.map((hoverTab, hoverIndex) => () => {
      // this works fine
      if (prevHoverIndex === hoverIndex) return

      // this works fine
      const isGoingLeft = isRtl
        ? prevHoverIndex < hoverIndex
        : prevHoverIndex > hoverIndex

      const previousTab = tabs[prevHoverIndex]
      const { offsetLeft, offsetWidth: hoverOffsetWidth } = hoverTab
      const hoverTabOffsetLeft =
        // -1px to fix horizontal scroll in Chrome/Edge
        offsetLeft + (hoverIndex === 0 ? 0 : sidePadding) - 1
      const { offsetLeft: prevOffsetLeft, offsetWidth: prevOffsetWidth } =
        previousTab

      const isExtremeElement =
        hoverIndex === 0 || hoverIndex + 1 === tabs.length
      const reduceWidth = isExtremeElement ? sidePadding : sidePadding * 2
      const hoverScale = (hoverOffsetWidth - reduceWidth) / containerWidth

      if (isGoingLeft) {
        const transitionWidth =
          prevOffsetLeft +
          prevOffsetWidth -
          hoverTabOffsetLeft -
          (prevHoverIndex === tabs.length - 1 ? 0 : sidePadding) -
          1
        const stretchScale = transitionWidth / containerWidth
        setScale(stretchScale)

        setLeft(hoverTabOffsetLeft)
        setTimeout(() => {
          setScale(hoverScale)
          // need to duplicate this, it fixes wrong position if navigate super fast using keyboard
          // setLeft()
        }, 100)
      } else {
        const transitionWidth =
          (prevHoverIndex === 0 ? hoverTabOffsetLeft : offsetLeft) +
          (hoverOffsetWidth - reduceWidth) -
          prevOffsetLeft
        const stretchScale = transitionWidth / containerWidth

        setScale(stretchScale)

        setTimeout(() => {
          setLeft(hoverTabOffsetLeft)
          setScale(hoverScale)
        }, 100)
      }

      // this works fine
      prevHoverIndex = hoverIndex
    })
    const mouseLeaveCallbacks = tabs.map(
      (leaveTab, leaveIndex) => (event: MouseEvent) => {
        if (selectedIndex === leaveIndex) return

        const toElement = event.relatedTarget as HTMLElement

        if (leaveTab === toElement) return

        const isSomeTab = tabs.some((tab) => tab.contains(toElement))

        if (!isSomeTab) {
          // if leaving the tab list, reset the underline to the selected tab
          prevHoverIndex = selectedIndex
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

  // underline animation & position logic (click & keyboard)
  // useEffect(() => {
  //   if (!isUnderline || !tabs.length || !refWrapper.current || !containerWidth)
  //     return

  //   const tabListElement = refWrapper.current.querySelector(
  //     '[data-reach-tab-list]'
  //   ) as HTMLDivElement

  //   if (!tabListElement) {
  //     throw new Error('tabListElement not found')
  //   }

  //   const selectedTab = tabs[selectedIndex]
  //   const prevSelectedTab = tabs[prevSelectedIndex]

  //   const isGoingLeft = isRtl
  //     ? selectedIndex > prevSelectedIndex
  //     : selectedIndex < prevSelectedIndex

  //   const { offsetLeft, offsetWidth } = selectedTab
  //   const { offsetLeft: prevOffsetLeft, offsetWidth: prevOffsetWidth } =
  //     prevSelectedTab
  //   // const containerWidth = tabListElement.offsetWidth

  //   const width = offsetWidth / containerWidth

  //   const containerElement = refWrapper.current

  //   if (isInit.current || containerWidth !== prevContainerWidth) {
  //     isInit.current = false
  //   }

  //   if (isGoingLeft) {
  //     const transitionWidth = prevOffsetLeft + prevOffsetWidth - offsetLeft

  //     containerElement.style.setProperty(
  //       '--_width',
  //       `${transitionWidth / containerWidth}`
  //     )

  //     const setLeft = () =>
  //       containerElement.style.setProperty('--_left', `${offsetLeft}px`)
  //     setLeft()

  //     setTimeout(() => {
  //       containerElement.style.setProperty('--_width', `${width}`)

  //       // need to duplicate this, it fixes wrong position if navigate super fast using keyboard
  //       setLeft()
  //     }, 100)
  //   } else {
  //     const transitionWidth = offsetLeft + offsetWidth - prevOffsetLeft
  //     const stretchWidth = transitionWidth / containerWidth

  //     containerElement.style.setProperty('--_width', `${stretchWidth}`)

  //     setTimeout(() => {
  //       containerElement.style.setProperty('--_left', `${offsetLeft}px`)
  //       containerElement.style.setProperty('--_width', `${width}`)
  //     }, 100)
  //   }
  //   // omitting `prevSelectedIndex` check as it causes multiple useEffect calls and this causes jiggle animation
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   selectedIndex,
  //   tabs,
  //   containerWidth,
  //   isUnderline,
  //   isRtl,
  //   refWrapper,
  //   prevContainerWidth
  // ])
}
