import { RefObject, useEffect } from 'react'
import { useTabsContext } from '@reach/tabs'

import usePrevious from 'hooks/usePrevious'

export const useContentHeightAnimation = (
  wrapperRef: RefObject<HTMLDivElement>
) => {
  const { selectedIndex } = useTabsContext()
  const previousSelectedIndex = usePrevious(selectedIndex)

  useEffect(() => {
    if (
      previousSelectedIndex === null ||
      selectedIndex === previousSelectedIndex
    )
      return

    if (!wrapperRef.current) return
    const panelsElement = wrapperRef.current.querySelector(
      '[data-reach-tab-panels]'
    ) as HTMLDivElement

    const allPanels = Array.from(
      wrapperRef.current.querySelectorAll('[data-reach-tab-panel]')
    ) as HTMLDivElement[]
    const selectedPanel = allPanels[selectedIndex]
    const previousSelectedPanel = allPanels[previousSelectedIndex]
    if (!selectedPanel) return console.warn('Selected panel not found')
    if (!previousSelectedPanel)
      return console.warn('Previous selected panel not found')
    if (!panelsElement) return console.warn('Panels element not found')

    const newPanelHeight = selectedPanel.offsetHeight
    const oldPanelHeight = previousSelectedPanel.offsetHeight

    const animationTime = getComputedStyle(panelsElement).getPropertyValue(
      '--panels-animation-time'
    )
    if (!animationTime)
      throw new Error('--panels-animation-time not found in css')
    if (!animationTime.includes('ms'))
      throw new Error('--panels-animation-time must be in ms')

    const animationTimeNumber = Number(animationTime.replace('ms', ''))

    // set fixed height so css would know starting point
    panelsElement.style.setProperty('--panel-height', `${oldPanelHeight}px`)

    // change height after render, then macro task (via timeout) to start animation
    setTimeout(() => {
      panelsElement.style.setProperty('--panel-height', `${newPanelHeight}px`)
      panelsElement.setAttribute('height-changing', '')
    })

    // remove fixed height & overflow: hidden after animation
    setTimeout(() => {
      panelsElement.style.setProperty('--panel-height', 'auto')
      panelsElement.removeAttribute('height-changing')
    }, animationTimeNumber)
  }, [selectedIndex, wrapperRef, previousSelectedIndex])
}
