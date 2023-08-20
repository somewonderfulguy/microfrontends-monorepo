import { useLayoutEffect } from 'react'
import type { Decorator } from '@storybook/react'
import { addons } from '@storybook/addons'

import * as themes from '../../../../.storybook/themes'

const ThemeStorybook: Decorator = (Story, context) => {
  const { globals } = context
  const multiselect: { [key: string]: string | string[] } = globals.multiselect

  const themeStorybook = multiselect.themeStorybook as
    | 'yellow'
    | 'darkRed'
    | 'dark'

  useLayoutEffect(() => {
    const _themeStorybook = themeStorybook
    window.parent.document.body.classList.add(_themeStorybook)
    console.log(1)
    return () => {
      window.parent.document.body.classList.remove(_themeStorybook)
    }
  }, [themeStorybook])

  // DO I NEED DECORATOR???
  const theme = themes[themeStorybook]

  // addons.setConfig({ theme })

  return <Story />
}

export default ThemeStorybook
