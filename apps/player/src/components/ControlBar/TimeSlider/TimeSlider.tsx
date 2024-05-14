import * as Slider from '@radix-ui/react-slider'

import styles from './TimeSlider.module.css'

const TimeSlider = () => {
  return (
    <Slider.Root className={styles.root} defaultValue={[93]} max={194} step={1}>
      <div className={styles.trackContainer}>
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
      </div>
      <Slider.Thumb className={styles.thumb} aria-label="Time" />
    </Slider.Root>
  )
}

export default TimeSlider
