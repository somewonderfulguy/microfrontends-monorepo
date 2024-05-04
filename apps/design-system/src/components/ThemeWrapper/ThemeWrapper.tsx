import { HTMLAttributes } from 'react'

import classNames from '@repo/shared/utils/classNames'
import { Theme } from '@repo/state/types'

import styles from './ThemeWrapper.module.css'

type Props = HTMLAttributes<HTMLDivElement> & {
  theme: Theme
}

const ThemeWrapper = ({ className, theme, ...props }: Props) => {
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
