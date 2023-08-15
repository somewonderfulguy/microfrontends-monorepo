import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'

export type Theme = 'yellow' | 'darkRed' | 'dark'

const ThemeStateContext = createContext<Theme | undefined>(undefined)
ThemeStateContext.displayName = 'ThemeStateContext'

const ThemeDispatchContext = createContext<
  Dispatch<SetStateAction<Theme>> | undefined
>(undefined)
ThemeDispatchContext.displayName = 'ThemeDispatchContext'

type Props = {
  children: ReactNode
  initialTheme?: Theme
}

const ThemeProvider = ({ children, initialTheme = 'yellow' }: Props) => {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={setTheme}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  )
}

const useThemeState = () => {
  const context = useContext(ThemeStateContext)
  if (context === undefined) {
    throw new Error('useThemeState must be used within a ThemeProvider')
  }
  return context
}

const useThemeDispatch = () => {
  const context = useContext(ThemeDispatchContext)
  if (context === undefined) {
    throw new Error('useThemeDispatch must be used within a ThemeProvider')
  }
  return context
}

export { ThemeProvider, useThemeState, useThemeDispatch }
