declare module '@mf/state/themeStore' {
  import {
    ThemeStoreProviderType,
    useThemeDispatchType,
    useThemeStoreType
  } from '@repo/state/types'
  const ThemeStoreProvider: ThemeStoreProviderType
  const useThemeStore: useThemeStoreType
  const useThemeDispatch: useThemeDispatchType
  export { ThemeStoreProvider, useThemeStore, useThemeDispatch }
}
