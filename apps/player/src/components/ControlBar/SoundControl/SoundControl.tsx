import Button from '@repo/design-system/controls/Button'

import styles from './SoundControl.module.css'
import SoundDisabledIcon from './assets/soundDisabled.svg?react'
import SoundLowIcon from './assets/soundLow.svg?react'
import SoundMaxIcon from './assets/soundMax.svg?react'

const SoundControl = () => {
  return (
    <Button buttonStyle="svg">
      <SoundMaxIcon />
    </Button>
  )
}

export default SoundControl
