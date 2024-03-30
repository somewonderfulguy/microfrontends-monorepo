import { HTMLProps } from 'react'

import styles from './useAvatar.module.css'

// TODO: add glitch effect
// TODO: add progressive loading
// TODO: add error handling with retry
// TODO: add fallback (blank avatar)

const useAvatar = <TElement extends HTMLElement>() => {
  return {
    getAvatarProps: ({ className = '', ...rest } = {}): HTMLProps<TElement> & {
      'data-augmented-ui': string
    } => ({
      // TODO: classNames
      className: `${styles.avatar} ${className}`.trim(),
      'data-augmented-ui': 'bl-clip border',
      ...rest
    })
  }
}

export default useAvatar
