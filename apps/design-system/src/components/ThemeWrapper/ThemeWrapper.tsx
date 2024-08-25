'use client'

import { HTMLAttributes, useLayoutEffect } from 'react'

import classNames from '@repo/shared/utils/classNames'
import {
  ThemeStoreProvider,
  useThemeStore,
  useThemeDispatch,
  Theme
} from '@repo/state/themeStore'

import './ThemeWrapper.css'
import styles from './ThemeWrapper.module.css'

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Use to override global theme - might be useful when needed blackOnWhite theme under yellow theme (hybrid), for debugging, or for storybook. */
  overrideTheme?: Theme
}

const ThemeWrapper = (props: Props) => {
  return (
    <ThemeStoreProvider>
      <ThemeWrapperImpl {...props} />
    </ThemeStoreProvider>
  )
}

const ThemeWrapperImpl = ({ className, overrideTheme, ...props }: Props) => {
  const themeFromStore = useThemeStore((s) => s)
  const theme = overrideTheme ?? themeFromStore
  const updateTheme = useThemeDispatch()

  useLayoutEffect(
    () => void (overrideTheme && updateTheme(overrideTheme)),
    [overrideTheme, updateTheme]
  )

  return (
    <div
      className={classNames(
        styles.theme,
        theme === 'yellow' && 'cyberpunk-ui-theme-yellow',
        theme === 'darkRed' && 'cyberpunk-ui-theme-dark-red',
        theme === 'dark' && 'cyberpunk-ui-theme-dark',
        theme === 'whiteOnBlack' && 'cyberpunk-ui-theme-white-on-black',
        className
      )}
      {...props}
    />
  )
}

export default ThemeWrapper
