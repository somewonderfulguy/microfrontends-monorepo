import createContextStore from '@repo/shared/utils/createContextStore'

export type Theme = 'yellow' | 'darkRed' | 'dark' | 'whiteOnBlack'

const result = createContextStore<Theme>('yellow', 'ThemeStoreProvider')
const {
  Provider: ThemeStoreProvider,
  useStoreValue: useThemeStore,
  useStoreDispatch: useThemeDispatch
} = result

export { ThemeStoreProvider, useThemeStore, useThemeDispatch }
