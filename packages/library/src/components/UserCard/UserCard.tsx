import avatar from './assets/silverhand300.jpg'
import styles from './UserCard.module.css'

const UserCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.userSection}>
        <div className={styles.avatar} data-augmented-ui="bl-clip border">
          <img src={avatar} alt="avatar" />
        </div>
        <div className={styles.name}>Johny Silverhand</div>
        <div>Rockerboy</div>
      </div>
      <div>Info will be here</div>
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
