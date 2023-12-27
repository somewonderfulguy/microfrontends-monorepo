import { create } from '@storybook/theming'

/**
 TODO: upd - no decorator anymore
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

const yellowColor = 'hsl(58, 100%, 48%)'
const turquoise = 'hsl(184, 100%, 50%)'
const turquoiseDark = 'hsl(184deg 100% 18%)'
const black = 'hsl(0, 0%, 0%)'
const white = 'hsl(0, 0%, 100%)'
const lightGrayOnDark = 'hsla(0, 0%, 100%, 0.2)'
const green = 'hsl(149, 85%, 52%)'

export const yellow = create({
  base: 'dark',

  // colors
  colorPrimary: turquoise,
  colorSecondary: turquoise,
  appBg: black,
  appContentBg: yellowColor,
  appBorderColor: lightGrayOnDark,
  textColor: white,
  barBg: black,
  barTextColor: white,
  barSelectedColor: turquoise,
  textMutedColor: white,
  booleanBg: turquoise,

  // textarea
  inputBg: turquoiseDark,
  inputTextColor: turquoise,
  inputBorder: turquoise,

  // wip
  textInverseColor: 'navy', // not sure this one is working
  buttonBg: 'green',
  buttonBorder: 'brown',
  booleanSelectedBg: 'orange',

  // typography
  fontBase: '"Blender Pro Book", sans-serif',
  fontCode: '"Audiowide Mono", monospace',

  // shapes
  appBorderRadius: 0,
  inputBorderRadius: 0,

  gridCellSize: 50,

  brandTitle: 'Cyberpunk'
})

export const darkRed = create({
  base: 'dark'
})

export const dark = create({
  base: 'light'
})
