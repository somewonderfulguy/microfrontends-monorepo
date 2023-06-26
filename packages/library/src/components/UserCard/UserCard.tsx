import { useGetUser } from '@api/userApi'

import avatar from './assets/silverhand300.jpg'
import styles from './UserCard.module.css'

const UserCard = () => {
  const { data } = useGetUser('1')
  return (
    <div className={styles.card}>
      <div className={styles.main}>
        <div className={styles.avatar} data-augmented-ui="bl-clip">
          <img src={avatar} alt="avatar" />
        </div>
        <div className={styles.name}>Johny Silverhand</div>
        <div className={styles.title}>Rockerboy</div>
        <div className={styles.controls}>
          <button className={styles.control} title="details">
            i
          </button>
          <button className={styles.control} title="location">
            loc.
          </button>
        </div>
      </div>
      <div className={styles.info}>
        Johnny Silverhand, born Robert John Linder, was a famous influential
        rockerboy and the lead singer of the band Samurai before its breakup in
        2008. A military veteran who defined the rockerboy movement to what it
        is today, he was the most prominent figure that fought against the
        corrupted NUSA government and megacorporations, often being described as
        a terrorist.
      </div>
    </div>
  )
}

export default UserCard
