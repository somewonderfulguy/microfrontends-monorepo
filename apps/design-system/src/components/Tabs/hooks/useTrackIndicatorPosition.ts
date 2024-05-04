import { useRef } from 'react'

import useMutationObserver from '@repo/shared/hooks/useMutationObserver'

import { useIndicatorPositionDispatch } from '../contexts'

export const useTrackIndicatorPosition = () => {
  const animatedRef = useRef<HTMLDivElement>(null)
  const dispatchIndicatorPosition = useIndicatorPositionDispatch()
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

          dispatchIndicatorPosition({
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

  return animatedRef
}
