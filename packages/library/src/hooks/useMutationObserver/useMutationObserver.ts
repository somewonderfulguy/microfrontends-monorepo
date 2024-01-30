import { RefObject, useCallback, useEffect, useRef } from 'react'

const useMutationObserver = <TElement extends HTMLElement>(
  elemRef: RefObject<TElement>,
  observer: MutationCallback,
  options: MutationObserverInit = {}
) => {
  const mutationObserver = useRef<MutationObserver | null>(null)

  const disconnect = useCallback(() => {
    if (!mutationObserver.current) return
    mutationObserver.current.disconnect()
  }, [])

  useEffect(() => {
    if (elemRef.current) {
      mutationObserver.current = new MutationObserver(observer)
      mutationObserver.current?.observe(elemRef.current, options)
    }
    return disconnect
  }, [observer, disconnect, options, elemRef])

  return [elemRef, disconnect] as const
}

export default useMutationObserver
