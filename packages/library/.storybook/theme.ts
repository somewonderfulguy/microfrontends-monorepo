import { create } from '@storybook/theming'

export default create({
  base: 'dark',

  colorPrimary: 'hotpink',
  colorSecondary: 'deepskyblue',

  // UI
  appBg: '#000',
  appContentBg: '#000',
  // appBorderColor: 'grey',
  // appBorderRadius: 4,

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
