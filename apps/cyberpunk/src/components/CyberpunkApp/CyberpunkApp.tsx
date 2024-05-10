import Player from '@repo/player';
import ThemeWrapper from '@repo/design-system/ThemeWrapper';

import Menu from '../Menu';

import styles from './CyberpunkApp.module.css';

const CyberpunkApp = () => {
  return (
    <ThemeWrapper className={styles.themeWrapper}>
      <div className={styles.appContainer}>
        <div className={styles.app}>
          <header className={styles.header}>
            <div className={styles.menuContainer}>
              <Menu />
            </div>
          </header>
          <Player className={styles.player} />
        </div>
      </div>
    </ThemeWrapper>
  );
};

export default CyberpunkApp;
