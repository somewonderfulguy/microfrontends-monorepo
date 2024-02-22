import { useRef, useState } from 'react'

import useMutationObserver from 'hooks/useMutationObserver'

export const useTrackIndicatorPosition = () => {
  const animatedRef = useRef<HTMLDivElement>(null)
  const [coordinates, setCoordinates] = useState({ left: 0, width: 0 })
  useMutationObserver(
    animatedRef,
    (mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style'
        ) {
          const newValue = (mutation.target as HTMLDivElement).getAttribute(
            'style'
          )
          const leftMatch = newValue?.match(/left:\s*([^;]+)/)
          const widthMatch = newValue?.match(/width:\s*([^;]+)/)

          setCoordinates({
            left: leftMatch ? parseFloat(leftMatch[1]) : 0,
            width: widthMatch ? parseFloat(widthMatch[1]) : 0
          })
        }
      })
    },
    {
      attributes: true,
      attributeFilter: ['style']
    }
  )

  return {
    animatedRef,
    coordinates
  }
}
