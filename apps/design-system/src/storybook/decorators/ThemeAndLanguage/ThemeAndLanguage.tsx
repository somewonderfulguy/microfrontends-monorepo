import { CSSProperties } from 'react'
import type { Decorator } from '@storybook/react'

import classNames from '@repo/shared/utils/classNames'

import ThemeWrapper from '../../../components/ThemeWrapper'
import { Theme, ThemeStorybook } from '../../../types/theme'

import styles from './ThemeAndLanguage.module.css'

const getClassNames = (theme: Theme | ThemeStorybook) => {
  switch (theme) {
    case 'yellow':
      return styles.gridElementYellow
    case 'darkRed':
      return styles.gridElementDarkRed
    case 'dark':
      return styles.gridElementDark
    default:
      return ''
  }
}

const ThemeAndLanguage: Decorator = (Story, context) => {
  const { globals, parameters, viewMode } = context
  const isDocs = viewMode === 'docs'
  const multiselect: { [key: string]: string | string[] } = globals.multiselect
  const gridElementCss = parameters.gridElementCss as CSSProperties | undefined

  const theme = multiselect.theme as Array<Theme>
  // TODO: const lang = multiselect.lang as Array<'en' | 'pl' | 'ua'>
  const orientation = multiselect.orientation as 'horizontal' | 'vertical'
  // TODO: const priority = globals.priority as 'theme' | 'lang'
  const themeStorybook = multiselect.themeStorybook as ThemeStorybook

  return (
    <div
      className={
        orientation === 'horizontal' ? styles.grid : styles.gridVertical
      }
    >
      {isDocs ? (
        <ThemeWrapper
          theme={themeStorybook}
          className={classNames(getClassNames(themeStorybook))}
          style={gridElementCss}
        >
          <Story />
        </ThemeWrapper>
      ) : (
        theme.map((_theme) => (
          <ThemeWrapper
            theme={_theme}
            key={_theme}
            className={classNames(
              getClassNames(_theme),
              _theme === 'whiteOnBlack' && styles.gridElementWhiteOnBlack
            )}
            style={gridElementCss}
          >
            <Story />
          </ThemeWrapper>
        ))
      )}
    </div>
  )
}

export default ThemeAndLanguage
