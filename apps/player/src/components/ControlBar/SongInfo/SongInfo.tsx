import styles from './SongInfo.module.css'
import preview from './assets/preview.jpg'

const SongInfo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={typeof preview === 'string' ? preview : (preview as { src: string })?.src}
          alt="Song preview"
          className={styles.image}
          data-augmented-ui="tl-clip"
        />
      </div>
      <div className="song-info__text">
        <h2 className={styles.name}>Night City</h2>
        <p className="song-info__artist">
          R E L and Artemis Delta • Cyberpunk 2077
          {/* : Radio, Vol. 3 (Original Soundtrack) • 2020 */}
        </p>
      </div>
    </div>
  )
}

export default SongInfo
