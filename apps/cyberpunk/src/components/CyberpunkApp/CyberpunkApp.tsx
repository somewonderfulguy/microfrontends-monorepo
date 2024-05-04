import useThemeStore from '@mf/state/themeStore';
import Player from '@repo/player';

import Menu from '../Menu';

import styles from './CyberpunkApp.module.css';

function CyberpunkApp() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theBears = useThemeStore((s) => s.theme);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const increaseTheBears = useThemeStore((s) => s.setTheme);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.menuContainer}>
          <Menu />
        </div>
      </header>
      <Player className={styles.player} />
    </>
  );
}

export default CyberpunkApp;
