import type { Decorator } from '@storybook/react'

import styles from './ThemeAndLanguage.module.css'

const ThemeAndLanguage: Decorator = (Story, context) => {
  const { globals } = context
  const multiselect: { [key: string]: string | string[] } = globals.multiselect

  const lang = multiselect.lang as Array<'en' | 'pl' | 'ua'>
  const theme = multiselect.theme as Array<'yellow' | 'darkRed' | 'dark'>
  const orientation = globals.orientation as 'horizontal' | 'vertical'
  const priority = globals.priority as 'theme' | 'lang'

  return (
    <div className={styles.grid}>
      {theme.map((_theme) => (
        <div
          className={
            _theme === 'yellow'
              ? styles.gridElementYellow
              : _theme === 'darkRed'
              ? styles.gridElementDarkRed
              : styles.gridElementDark
          }
          key={_theme}
        >
          <Story />
        </div>
      ))}
    </div>
  )
}

export default ThemeAndLanguage
