import generateContext from '../../../utils/generateContext'

const {
  Provider: IndicatorPositionProvider,
  useStoreValue: useIndicatorPositionValue,
  useStoreDispatch: useIndicatorPositionDispatch
} = generateContext(
  { left: 0, width: 0, isGoingLeft: false },
  'IndicatorPositionProvider'
)

export {
  IndicatorPositionProvider,
  useIndicatorPositionValue,
  useIndicatorPositionDispatch
}
