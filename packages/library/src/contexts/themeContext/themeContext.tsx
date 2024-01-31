import React, {
  createContext,
  CSSProperties,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react'

import classNames from 'utils/classNames'
import { Theme } from 'types/theme'

import styles from './themeContext.module.css'

const ThemeStateContext = createContext<Theme | undefined>(undefined)
ThemeStateContext.displayName = 'ThemeStateContext'

const ThemeDispatchContext = createContext<
  Dispatch<SetStateAction<Theme>> | undefined
>(undefined)
ThemeDispatchContext.displayName = 'ThemeDispatchContext'

type Props = {
  children: ReactNode
  className?: string
  initialTheme?: Theme
  style?: CSSProperties
}

const ThemeProvider = ({
  children,
  className,
  initialTheme = 'yellow',
  style
}: Props) => {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={setTheme}>
        <div
          className={classNames(
            styles.theme,
            theme === 'yellow' && 'cyberpunk-ui-theme-yellow',
            theme === 'darkRed' && 'cyberpunk-ui-theme-dark-red',
            theme === 'dark' && 'cyberpunk-ui-theme-dark',
            theme === 'whiteOnBlack' && 'cyberpunk-ui-theme-white-on-black',
            className
          )}
          style={style}
        >
          {children}
        </div>
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
