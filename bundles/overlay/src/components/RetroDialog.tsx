import type { CSSProperties, ReactNode } from 'react';
import styles from './styles/RetroDialog.module.css';

interface RetroDialogProps {
  title: string;
  titleSize?: CSSProperties['fontSize'];
  headerColor?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const RetroDialog = ({
  title,
  titleSize = '14px',
  headerColor = 'var(--background)',
  right,
  children,
  className,
}: RetroDialogProps) => {
  return (
    <div className={`${styles.dialog}${className ? ` ${className}` : ''}`}>
      <div className={styles.header} style={{ backgroundColor: headerColor }}>
        <span className={styles.title} style={{ fontSize: titleSize }}>
          {title}
        </span>
        {right ?? (
          <div className={styles.buttons}>
            <div className={styles.button}>
              <p className={styles.buttonMinimize}>_</p>
            </div>
            <div className={styles.button}>
              <p className={styles.buttonClose}>x</p>
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
