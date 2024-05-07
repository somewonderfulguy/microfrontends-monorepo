import createContextStore from '@repo/shared/utils/createContextStore'

export type Theme = 'yellow' | 'darkRed' | 'dark' | 'whiteOnBlack'

const result = createContextStore<Theme>('yellow', 'ThemeStoreProvider')
const {
  Provider: ThemeStoreProvider,
  useStoreValue: useThemeStore,
  useStoreDispatch: useThemeDispatch
} = result

export type ThemeStoreProviderType = typeof ThemeStoreProvider
export type useThemeStoreType = typeof useThemeStore
export type useThemeDispatchType = typeof useThemeDispatch

export { ThemeStoreProvider, useThemeStore, useThemeDispatch }
