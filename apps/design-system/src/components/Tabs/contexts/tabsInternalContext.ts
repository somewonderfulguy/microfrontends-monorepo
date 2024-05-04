import createContextStore from '@repo/shared/utils/createContextStore'

import type { TabsStyle } from '../Tabs'
import { useMemo } from 'react'

const initState = {
  type: 'underline' as TabsStyle,
  animateOnHover: false,
  tabsQty: 0,
  isRtl: false
}

const {
  Provider: TabsInternalProvider,
  useStoreValue: useTabsInternalValue,
  useStoreDispatch: useTabsInternalDispatch
} = createContextStore(initState, 'TabsInternalProvider')

const useTabsRegistration = () => {
  const dispatch = useTabsInternalDispatch()

  return useMemo(
    () => ({
      registerTab: () =>
        dispatch((prevState) => ({
          ...prevState,
          tabsQty: prevState.tabsQty + 1
        })),
      unregisterTab: () =>
        dispatch((prevState) => ({
          ...prevState,
          tabsQty: prevState.tabsQty - 1
        }))
    }),
    [dispatch]
  )
}

export {
  TabsInternalProvider,
  useTabsInternalValue,
  useTabsInternalDispatch,
  useTabsRegistration
}
