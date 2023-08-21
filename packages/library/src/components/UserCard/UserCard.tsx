import TextCard from './TextCard'

import useAvatar from 'hooks/useAvatar'
import { useThemeState } from 'contexts/themeContext'

import avatar from './assets/silverhand300.jpg'
import avatarRed from './assets/silverhand300_red.jpg'
import avatarGreen from './assets/silverhand300_green.jpg'
import styles from './UserCard.module.css'

const UserCard = () => {
  const { getAvatarProps } = useAvatar<HTMLDivElement>()
  const theme = useThemeState()

  return (
    <div className={styles.card}>
      <div className={styles.userSection}>
        <div {...getAvatarProps()}>
          <img
            src={
              theme === 'darkRed'
                ? avatarRed
                : theme === 'dark'
                ? avatarGreen
                : avatar
            }
            alt="avatar"
          />
        </div>
        <div className={styles.name}>Johnny Silverhand</div>
        <div>Rockerboy</div>
      </div>
      <div>
        <TextCard>
          Johnny Silverhand, born Robert John Linder, was a famous influential
          rockerboy and the lead singer of the band Samurai before its breakup
          in 2008. A military veteran who defined the rockerboy movement to what
          it is today, he was the most prominent figure that fought against the
          corrupted NUSA government and megacorporations, often being described
          as a terrorist.
        </TextCard>
      </div>
      {/* 
        <div className={styles.controls}>
          <button className={styles.control} title="details">
            i
          </button>
          <button className={styles.control} title="location">
            loc.
          </button>
        </div> */}
    </div>
  )
}

export default UserCard
