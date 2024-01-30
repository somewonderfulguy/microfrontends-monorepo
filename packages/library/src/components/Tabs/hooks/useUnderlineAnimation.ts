import { useEffect, MutableRefObject } from 'react'
import { useTabsContext } from '@reach/tabs'

import usePrevious from 'hooks/usePrevious'

import { useTabsInternalContext } from '../contexts'

export const useUnderlineAnimation = (
  tabs: HTMLButtonElement[],
  refWrapper: MutableRefObject<HTMLDivElement>,
  containerWidth: number
) => {
  const { selectedIndex } = useTabsContext()
  const prevSelectedIndex = usePrevious(selectedIndex) || 0

  const tabsStyle = useTabsInternalContext()
  const isUnderline = tabsStyle === 'underline'

  // underline move logic
  useEffect(() => {
    if (!isUnderline || !tabs.length || !refWrapper.current) return

    const tabListElement = refWrapper.current.querySelector(
      '[data-reach-tab-list]'
    ) as HTMLDivElement

    if (!tabListElement) {
      return console.warn('tabListElement not found')
    }

    const selectedTab = tabs[selectedIndex]
    const prevSelectedTab = tabs[prevSelectedIndex]

    const isGoingLeft = prevSelectedIndex > selectedIndex

    const { offsetLeft, offsetWidth } = selectedTab
    const { offsetLeft: prevOffsetLeft, offsetWidth: prevOffsetWidth } =
      prevSelectedTab
    const containerWidth = tabListElement.offsetWidth

    const width = offsetWidth / containerWidth

    const containerElement = refWrapper.current

    if (isGoingLeft) {
      const transitionWidth = prevOffsetLeft + prevOffsetWidth - offsetLeft

      containerElement.style.setProperty(
        '--_width',
        `${transitionWidth / containerWidth}`
      )
      containerElement.style.setProperty('--_left', `${offsetLeft}px`)

      setTimeout(() => {
        containerElement.style.setProperty('--_width', `${width}`)
      }, 100)
    } else {
      const transitionWidth = offsetLeft + offsetWidth - prevOffsetLeft
      const stretchWidth = transitionWidth / containerWidth

      containerElement.style.setProperty('--_width', `${stretchWidth}`)

      setTimeout(() => {
        containerElement.style.setProperty('--_left', `${offsetLeft}px`)
        containerElement.style.setProperty('--_width', `${width}`)
      }, 100)
    }
    // omitting `prevSelectedIndex` check as it causes multiple useEffect calls and this causes jiggle animation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, tabs, containerWidth, isUnderline])
}
