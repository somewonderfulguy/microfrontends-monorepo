import { RefObject, useEffect } from 'react'
import { useTabsContext } from '@reach/tabs'

export const useContentHeightAnimation = (
  wrapperRef: RefObject<HTMLDivElement>
) => {
  const { selectedIndex } = useTabsContext()

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
  }, [selectedIndex, wrapperRef])
}
