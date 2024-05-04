import Button from '@repo/design-system/controls/Button'
import ThemeWrapper from '@repo/design-system/ThemeWrapper'
import PlayIcon from '@repo/design-system/assets/trianglePointsToRight.svg?react'

import styles from './ControlBar.module.css'
import graffiti from './assets/graffiti.png'
import sprayTopRight from './assets/sprayTopRight.png'
import sprayBottomLeak from './assets/sprayBottomLeak2.png'

const ControlBar = () => {
  return (
    <ThemeWrapper theme="whiteOnBlack">
      <div className={styles.controlBarWrapper}>
        <div className={styles.controlBarContainer}>
          <div
            aria-hidden="true"
            className={styles.graffitiText}
            style={{ backgroundImage: `url('${graffiti}')` }}
          />
          <div
            aria-hidden="true"
            className={styles.sprayTopRight}
            style={{ backgroundImage: `url('${sprayTopRight}')` }}
          />
          <div
            aria-hidden="true"
            className={styles.sprayBottomLeak}
            style={{ backgroundImage: `url('${sprayBottomLeak}')` }}
          />
          <div className={styles.controlBar}>
            <div style={{ color: '#fff' }}>Music</div>
            <div className={styles.mainButtons}>
              <button>Pause</button>
              <Button cutBottomLeftCorner className={styles.playBtn}>
                <PlayIcon />
              </Button>
              <button>Stop</button>
            </div>
            <div style={{ color: '#fff' }}>More controls</div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  )
}

export default ControlBar
