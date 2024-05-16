import Button from '@repo/design-system/controls/Button'
import ThemeWrapper from '@repo/design-system/ThemeWrapper'

import SongInfo from './SongInfo'
import TimeSlider from './TimeSlider'
import SoundControl from './SoundControl'

import styles from './ControlBar.module.css'
import PlayIcon from './assets/trianglePointsToRight.svg?react'
import PrevIcon from './assets/previous.svg?react'
import graffiti from './assets/graffiti.png'
import sprayTopRight from './assets/sprayTopRight.png'
import sprayBottomLeak from './assets/sprayBottomLeak2.png'
import Repeat from './assets/repeat.svg?react'
import Shuffle from './assets/shuffle.svg?react'

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
          <div className={styles.sliderContainer}>
            <TimeSlider />
          </div>
          <div className={styles.time}>
            1:33 <span className={styles.timeSeparator}>/</span> 3:14
          </div>
          <div
            className={styles.controlBar}
            data-augmented-ui="bl-clip-x tr-clip tl-clip"
          >
            <div>
              <SongInfo />
            </div>
            <div className={styles.mainButtons}>
              <button type="button" className={styles.shuffleButton}>
                <Shuffle />
              </button>
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
              {/* aria-pressed={state !== 0}
              aria-label={'No Repeat' | 'Repeat All' | 'Repeat One'} */}
              <button type="button" className={styles.repeatButton}>
                <Repeat />
              </button>
            </div>
            <div className={styles.sideControls}>
              <SoundControl />
            </div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  )
}

export default ControlBar
