import Button from '@repo/design-system/controls/Button'
import ThemeWrapper from '@repo/design-system/ThemeWrapper'

import styles from './ControlBar.module.css'
import PlayIcon from './assets/trianglePointsToRight.svg?react'
import PrevIcon from './assets/previous.svg?react'
import graffiti from './assets/graffiti.png'
import sprayTopRight from './assets/sprayTopRight.png'
import sprayBottomLeak from './assets/sprayBottomLeak2.png'

const ControlBar = () => {
  return (
    <ThemeWrapper overrideTheme="whiteOnBlack">
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
              <Button
                cutBottomLeftCorner
                className={styles.prevBtn}
                buttonSize="small"
              >
                <PrevIcon />
              </Button>
              <Button cutBottomLeftCorner className={styles.playBtn}>
                <PlayIcon />
              </Button>
              <Button
                cutBottomRightCorner
                className={styles.nextButton}
                buttonSize="small"
              >
                <PrevIcon />
              </Button>
            </div>
            <div style={{ color: '#fff' }}>More controls</div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  )
}

export default ControlBar
