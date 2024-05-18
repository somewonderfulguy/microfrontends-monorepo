import * as Slider from '@radix-ui/react-slider'

import Button from '@repo/design-system/controls/Button'

import styles from './SoundControl.module.css'
import SoundDisabledIcon from './assets/soundDisabled.svg?react'
import SoundLowIcon from './assets/soundLow.svg?react'
import SoundMaxIcon from './assets/soundMax.svg?react'

const SoundControl = () => {
  return (
    <div className={styles.container}>
      <Button buttonStyle="svg">
        <SoundMaxIcon />
      </Button>

      {/* TODO: create generic slider component */}
      <div className={styles.sliderContainer}>
        <Slider.Root
          className={styles.root}
          defaultValue={[100]}
          max={100}
          step={1}
        >
          <Slider.Track className={styles.track}>
            <Slider.Range className={styles.range} />
          </Slider.Track>
          <Slider.Thumb className={styles.thumb} aria-label="Volume" />
        </Slider.Root>
      </div>
    </div>
  )
}

export default SoundControl
