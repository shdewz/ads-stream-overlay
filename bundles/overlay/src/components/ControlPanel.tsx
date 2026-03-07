import type { ReactNode } from 'react';
import styles from './styles/ControlPanel.module.css';

interface ControlPanelProps {
  children: ReactNode;
}

export const ControlPanel = ({ children }: ControlPanelProps) => {
  return <div className={styles.panel}>{children}</div>;
};

interface ControlPanelGroupProps {
  title: string;
  children: ReactNode;
}

export const ControlPanelGroup = ({ title, children }: ControlPanelGroupProps) => {
  return (
    <div className={styles.group}>
      <span className={styles.groupTitle}>{title}</span>
      {children}
    </div>
  );
};
