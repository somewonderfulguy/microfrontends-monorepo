import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react'

import type { TabsStyle } from '../Tabs'

type Context = {
  type: TabsStyle
  animateOnHover: boolean
  tabsQty: number
  registerTab: () => void
  unregisterTab: () => void
  isRtl: boolean
  setIsRtl: Dispatch<SetStateAction<boolean>>
}

const TabsInternalContext = createContext<Context | undefined>(undefined)
TabsInternalContext.displayName = 'TabsInternalContext'

const TabsInternalProvider = ({
  type,
  animateOnHover,
  children
}: {
  type: TabsStyle
  animateOnHover: boolean
  children: ReactNode
}) => {
  const [tabsQty, setTabsQty] = useState(0)
  const registerTab = useCallback(() => setTabsQty((prev) => prev + 1), [])
  const unregisterTab = useCallback(() => setTabsQty((prev) => prev - 1), [])
  const [isRtl, setIsRtl] = useState(false)
  return (
    <TabsInternalContext.Provider
      value={{
        type,
        animateOnHover,
        tabsQty,
        registerTab,
        unregisterTab,
        isRtl,
        setIsRtl
      }}
    >
      {children}
    </TabsInternalContext.Provider>
  )
}

const useTabsInternalContext = () => {
  const context = useContext(TabsInternalContext)
  if (context === undefined) {
    throw new Error(
      'useTabsInternalContext must be used within a TabsInternalProvider'
    )
  }
  return context
}

export { TabsInternalProvider, useTabsInternalContext }
