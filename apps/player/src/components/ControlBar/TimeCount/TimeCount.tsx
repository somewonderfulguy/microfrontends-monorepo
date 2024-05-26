import { HTMLAttributes } from 'react'

import classNames from '@repo/shared/utils/classNames'

import styles from './TimeCount.module.css'

const TimeCount = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={classNames(styles.time, className)} {...props}>
      1:33 <span className={styles.timeSeparator}>/</span> 3:14
    </div>
  )
}

export default TimeCount
