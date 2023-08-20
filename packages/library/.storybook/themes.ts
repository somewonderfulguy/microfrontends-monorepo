import { create } from '@storybook/theming'

/**
 * full theme control in these files:
 * - .storybook/manager.ts - setting initial theme
 * - .storybook/preview.ts - one, setting multiselect with `themeStorybook` property; two, setting decorator ThemeStorybook
 * - .storybook/themes.ts - base theme configuration
 * - public/theme.css - extra theme configuration (something that can't be done in base configuration)
 * - .storybook/manager-head.html - add link to theme.css
 * - src/storybook/decorators/ThemeStorybook.tsx - change theme logic, add class to body of Storybook app (outside iframe)
 */

// TODO:
// Step 1: create only one yellow theme, without logo
// Step 2: do the same for darkRed
// Step 3: do the same for dark
// Step 4: create logo for yellow theme
// Step 5: create logo for darkRed theme
// Step 6: create logo for dark theme
// Step 7: experiment with cursor

interface ThemeVarsColors {
  colorPrimary: string
  colorSecondary: string
  appBg: string
  appContentBg: string
  appBorderColor: string
  appBorderRadius: number
  fontBase: string
  fontCode: string
  textColor: string
  textInverseColor: string
  textMutedColor: string
  barTextColor: string
  barSelectedColor: string
  barBg: string
  buttonBg: string
  buttonBorder: string
  booleanBg: string
  booleanSelectedBg: string
  inputBg: string
  inputBorder: string
  inputTextColor: string
  inputBorderRadius: number
  brandTitle?: string
  brandUrl?: string
  brandImage?: string
  brandTarget?: string
  gridCellSize?: number
}

export const yellow = create({
  base: 'dark',

  appBorderRadius: 0,
  colorPrimary: 'green', // does it work?
  colorSecondary: 'deepskyblue',

  // UI
  appBg: '#000',
  appContentBg: '#000',
  // appBorderColor: 'grey',

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'white',
  // textInverseColor: 'rgba(0, 0, 0, 0.9)',

  // Toolbar default and active colors
  // barTextColor: 'silver',
  // barSelectedColor: 'black',
  barBg: '#89eaea'

  // // Form colors
  // inputBg: 'white',
  // inputBorder: 'silver',
  // inputTextColor: 'black',
  // inputBorderRadius: 4,

  // brandTitle: 'My custom storybook',
  // brandUrl: 'https://example.com',
  // brandImage: 'https://place-hold.it/350x150',
  // brandTarget: '_self'
})

export const darkRed = create({
  base: 'dark'
})

export const dark = create({
  base: 'light'
})
