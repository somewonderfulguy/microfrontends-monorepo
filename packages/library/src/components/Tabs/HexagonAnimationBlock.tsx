import { useTabsContext } from '@reach/tabs'
import {
  MutableRefObject,
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useState
} from 'react'

import { useIndicatorPositionValue, useTabsInternalValue } from './contexts'

type Props = {
  children: ReactNode
  contentRef: RefObject<HTMLDivElement>
  isHover: MutableRefObject<boolean>
}

const HexagonAnimationBlock = ({ contentRef, children, isHover }: Props) => {
  const { selectedIndex } = useTabsContext()
  const animateOnHover = useTabsInternalValue((state) => state.animateOnHover)

  const {
    left: indicatorLeft,
    width: indicatorWidth,
    isGoingLeft
  } = useIndicatorPositionValue((state) => state)

  const offsetLeft = contentRef.current?.parentElement?.offsetLeft || 0
  const width = contentRef.current?.offsetWidth || 0

  const [isSelected, setIsSelected] = useState(false)
  useLayoutEffect(() => {
    const findIsSelected = () => {
      const id = contentRef.current?.parentElement?.id

      if (id) {
        const idNum = Number(id.replace('tabs--tab--', ''))
        setIsSelected(idNum === selectedIndex)

        if (idNum === -1) {
          setTimeout(findIsSelected)
        }
      }
    }
    findIsSelected()
  }, [contentRef, selectedIndex])

  // TODO: check if this is necessary or it could be derived
  const [{ leftClip, rightClip }, setClipValues] = useState({
    leftClip: indicatorLeft - offsetLeft,
    rightClip: indicatorWidth + indicatorLeft - offsetLeft
  })
  useEffect(() => {
    setTimeout(() => {
      setClipValues({
        leftClip: indicatorLeft - offsetLeft,
        rightClip: indicatorWidth + indicatorLeft - offsetLeft
      })
    }, 0)
  }, [indicatorLeft, indicatorWidth, offsetLeft])

  // TODO: fix hardcoded values
  const thresholdRight = 24
  const thresholdLeft = 27
  const threshold = isGoingLeft ? thresholdLeft : thresholdRight

  const baseLeftEdge = leftClip - threshold
  const baseRightEdge = rightClip - threshold
  const leftEdge =
    !animateOnHover && isSelected && isGoingLeft ? width : baseLeftEdge
  const rightEdge =
    !animateOnHover && isSelected && !isGoingLeft ? 0 : baseRightEdge
  const height = !animateOnHover && isHover.current ? 0 : '100%'

  return (
    <div
      data-reach-tab-clone
      aria-hidden
      data-offset-left={offsetLeft}
      style={{
        // clip path is to animate text when background is moving
        clipPath: `polygon(
          ${/* top-left */ leftEdge}px 0,
          ${/* top-right */ rightEdge}px 0,
          ${/* bottom-right */ rightEdge}px ${height},
          ${/* bottom-left */ leftEdge}px ${height})`
      }}
    >
      {children}
    </div>
  )
}

export default HexagonAnimationBlock
