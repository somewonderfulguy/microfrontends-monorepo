import { createContext, ReactNode, useContext } from 'react'

import type { TabsStyle } from '../Tabs'

const TabsInternalContext = createContext<TabsStyle | undefined>(undefined)
TabsInternalContext.displayName = 'TabsInternalContext'

const TabsInternalProvider = ({
  type,
  children
}: {
  type: TabsStyle
  children: ReactNode
}) => {
  return (
    <TabsInternalContext.Provider value={type}>
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
