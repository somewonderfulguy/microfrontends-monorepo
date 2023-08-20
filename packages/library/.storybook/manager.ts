import { addons } from '@storybook/addons'

import { yellow, darkRed } from './themes'

/*
const currentStore = store();
const currentTheme =
  currentStore.current || (prefersDark.matches && 'dark') || 'light';
*/

addons.setConfig({
  theme: yellow
})

setTimeout(() => {
  console.log(window.document.body)
  addons.setConfig({
    theme: darkRed
  })
}, 5000)
