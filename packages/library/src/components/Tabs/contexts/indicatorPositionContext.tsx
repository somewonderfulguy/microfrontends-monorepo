import { createContext, ReactNode, useContext } from 'react'

type Context = { left: number; width: number; isGoingLeft: boolean }
const IndicatorPositionContext = createContext<Context | undefined>(undefined)
IndicatorPositionContext.displayName = 'IndicatorPositionContext'

const IndicatorPositionProvider = ({
  value,
  children
}: {
  value: Context
  children: ReactNode
}) => {
  return (
    <IndicatorPositionContext.Provider value={value}>
      {children}
    </IndicatorPositionContext.Provider>
  )
}

const useIndicatorPositionContext = () => {
  const context = useContext(IndicatorPositionContext)
  if (context === undefined) {
    throw new Error(
      'useIndicatorPositionContext must be used within a IndicatorPositionProvider'
    )
  }
  return context
}

export { IndicatorPositionProvider, useIndicatorPositionContext }
