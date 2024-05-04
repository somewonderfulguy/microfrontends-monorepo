import { RefObject, useEffect, useState } from 'react'
import { useTabsContext } from '@reach/tabs'

import usePrevious from '@repo/shared/hooks/usePrevious'

export const useFadeInOutAnimation = (divElem: RefObject<HTMLDivElement>) => {
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
  }, [divElem])

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
          panelElem.removeAttribute('closed')
        },
        { once: true }
      )
    }
  }, [selectedIndex, prevSelectedIndex, index, divElem])
}
