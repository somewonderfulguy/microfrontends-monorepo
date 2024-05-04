import { create } from 'zustand'

export type Theme = 'yellow' | 'darkRed' | 'dark' | 'whiteOnBlack'

export type ThemeStore = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const useThemeStore = create<ThemeStore>()((set) => ({
  theme: 'yellow',
  setTheme: (theme) => set({ theme })
}))

export type UseThemeStore = typeof useThemeStore

export default useThemeStore
