import React, { useEffect } from 'react'
import type { Decorator } from '@storybook/react'

const withThemeAndLanguage: Decorator = (Story, context) => {
  const { globals } = context
  const multiselect: { [key: string]: string | string[] } = globals.multiselect

  const lang = multiselect.lang as Array<'en' | 'pl' | 'ua'>
  const theme = multiselect.theme as Array<'yellow' | 'darkRed' | 'dark'>
  const orientation = globals.orientation as 'horizontal' | 'vertical'
  const priority = globals.priority as 'theme' | 'lang'

  useEffect(() => {
    const html = document.querySelector('html')
    if (html) html.style.height = '100%'
  }, [])

  useEffect(() => {
    const html = document.querySelector('html')
    const docsStory = document.querySelectorAll('.docs-story')
    if (!html) return

    const setBgColor = (color: string) => {
      html.style.background = color
      if (docsStory?.length)
        docsStory.forEach((elem) => {
          ;(elem as HTMLDivElement).style.background = color
        })
    }

    switch (theme[0]) {
      case 'yellow': {
        setBgColor('#f5ed00')
        break
      }
      case 'darkRed': {
        setBgColor(
          'linear-gradient(355deg, rgba(5,9,14,1) 0%, rgba(71,21,25,1) 100%)'
        )
        break
      }
      case 'dark':
        setBgColor('#171017')
        break
    }
  }, [theme])

  return (
    <div>
      <Story />
    </div>
  )
}

export default withThemeAndLanguage
