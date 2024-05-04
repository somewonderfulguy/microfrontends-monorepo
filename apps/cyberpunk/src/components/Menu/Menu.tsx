import { HTMLAttributes } from 'react';

import styles from './Menu.module.css';

const Menu = ({
  className = '',
  ...props
}: HTMLAttributes<HTMLUListElement>) => {
  return (
    <ul
      className={`${styles.menu} ${className}`}
      {...props}
      data-augmented-ui="tl-clip br-clip"
    >
      <li>
        <span className={styles.menuDropdown}>En</span>
      </li>
      <li>
        <span className={styles.menuDropdown}>Theme</span>
      </li>
    </ul>
  );
};

export default Menu;
