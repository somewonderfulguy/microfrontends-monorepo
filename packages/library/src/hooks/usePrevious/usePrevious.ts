import { useRef, useEffect, MutableRefObject } from 'react'

const usePrevious = <TValue>(value: TValue): TValue | null => {
  const ref: MutableRefObject<TValue | null> = useRef(null)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default usePrevious
