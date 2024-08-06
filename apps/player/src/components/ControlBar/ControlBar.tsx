import Button from '@repo/design-system/controls/Button'
import ThemeWrapper from '@repo/design-system/ThemeWrapper'

import SongInfo from './SongInfo'
import TimeSlider from './TimeSlider'
import SoundControl from './SoundControl'
import FullscreenButton from './FullscreenButton'
import TimeCount from './TimeCount'

import styles from './ControlBar.module.css'
import PlayIcon from './assets/trianglePointsToRight.svg?react'
import PrevIcon from './assets/previous.svg?react'
import graffiti from './assets/graffiti.png'
import sprayTopRight from './assets/sprayTopRight.png'
import sprayBottomLeak from './assets/sprayBottomLeak2.png'
import Repeat from './assets/repeat.svg?react'
import Shuffle from './assets/shuffle.svg?react'

const getImgUrl = (img: unknown) => typeof img === 'string' ? img : (img as { src: string })?.src

const ControlBar = () => {
  return (
    <ThemeWrapper overrideTheme="whiteOnBlack">
      <div className={styles.controlBarWrapper}>
        <div className={styles.controlBarContainer}>
          <div
            aria-hidden="true"
            className={styles.graffitiText}
            style={{ backgroundImage: `url('${getImgUrl(graffiti)}')` }}
          />
          <div
            aria-hidden="true"
            className={styles.sprayTopRight}
            style={{ backgroundImage: `url('${getImgUrl(sprayTopRight)}')` }}
          />
          <div
            aria-hidden="true"
            className={styles.sprayBottomLeak}
            style={{ backgroundImage: `url('${getImgUrl(sprayBottomLeak)}')` }}
          />
          <div className={styles.sliderContainer}>
            <TimeSlider />
          </div>
          <TimeCount className={styles.time} />
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
              <FullscreenButton />
            </div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  )
}

export default ControlBar
