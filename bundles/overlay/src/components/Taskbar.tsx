import { useState, useEffect } from 'react';
import styles from './styles/Taskbar.module.css';

interface TaskbarProps {
  activeWindow: string;
}

const useUtcClock = (): string => {
  const fmt = () => {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    return `${hh}:${mm} UTC`;
  };
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

export const Taskbar = ({ activeWindow }: TaskbarProps) => {
  const time = useUtcClock();

  return (
    <div className={styles.taskbar}>
      <button className={`${styles.chromeItem} ${styles.start} ${styles.raised}`}>
        <span className={styles.startIcon}></span>
        Start
      </button>
      <div className={styles.divider} />
      <div className={styles.windows}>
        <button
          className={`${styles.chromeItem} ${styles.windowBtn} ${styles.active} ${styles.sunken}`}
        >
          {activeWindow}
        </button>
      </div>
      <div className={`${styles.chromeItem} ${styles.tray} ${styles.sunken}`}>
        <span className={styles.clock}>{time}</span>
      </div>
    </div>
  );
};
