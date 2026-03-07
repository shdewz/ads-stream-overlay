import type { CSSProperties } from 'react';
import styles from './styles/Logo.module.css';

interface LogoProps {
  division: string;
  size?: CSSProperties['fontSize'];
}

export const Logo = ({ division, size = '86px' }: LogoProps) => {
  return (
    <div className={styles.block} style={{ fontSize: size }}>
      <div className={styles.letters}>
        <span className={styles.letterA}>A</span>
        <span className={styles.letterD}>D</span>
        <span className={styles.letterS}>S</span>
      </div>
      <div className={styles.barRow}>
        <div className={styles.barSegment} />
        <span className={styles.division}>{division}</span>
        <div className={styles.barSegment} />
      </div>
    </div>
  );
};
