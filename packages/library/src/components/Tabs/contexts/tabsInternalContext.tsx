import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'

import type { TabsStyle } from '../Tabs'

type Context = {
  type: TabsStyle
  tabsQty: number
  registerTab: () => void
  unregisterTab: () => void
}

const TabsInternalContext = createContext<Context | undefined>(undefined)
TabsInternalContext.displayName = 'TabsInternalContext'

const TabsInternalProvider = ({
  type,
  children
}: {
  type: TabsStyle
  children: ReactNode
}) => {
  const [tabsQty, setTabsQty] = useState(0)
  const registerTab = useCallback(() => setTabsQty((prev) => prev + 1), [])
  const unregisterTab = useCallback(() => setTabsQty((prev) => prev - 1), [])
  return (
    <TabsInternalContext.Provider
      value={{ type, tabsQty, registerTab, unregisterTab }}
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
