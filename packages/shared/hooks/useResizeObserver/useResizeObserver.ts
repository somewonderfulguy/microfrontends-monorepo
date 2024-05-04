import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import throttle from '../../utils/throttle'

type Bounds = { left: number; top: number; width: number; height: number }

const useResizeObserver = <TElement extends HTMLElement = HTMLDivElement>(
  callback: (bounds: Bounds) => void,
  throttleDelay = 0
) => {
  const elemRef = useRef<TElement>(null)

  const observer = throttle(
    (([entry]) => {
      const newBounds = Array.isArray(entry)
        ? entry[0].contentRect
        : entry.contentRect
      callback(newBounds)
    }) as ResizeObserverCallback,
    throttleDelay
  )
  const [resizeObserver] = useState(() => new ResizeObserver(observer))
  const disconnect = useCallback(
    () => resizeObserver.disconnect(),
    [resizeObserver]
  )

  useLayoutEffect(() => {
    if (elemRef.current) {
      resizeObserver.observe(elemRef.current)
    }
    return disconnect
  }, [resizeObserver, disconnect, elemRef])

  return elemRef
}

export default useResizeObserver
