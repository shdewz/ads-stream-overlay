import { RetroDialog } from '@/components/RetroDialog';
import styles from './styles/TeamPanel.module.css';

export interface TeamPanelProps {
  side: 'red' | 'blue';
  name: string;
  points: number;
  maxPoints: number;
}

export const TeamPanel = ({ side, name, points, maxPoints }: TeamPanelProps) => {
  return (
    <RetroDialog
      title={`${side.toUpperCase()}_TEAM.TXT`}
      headerColor={side === 'red' ? 'var(--red)' : 'var(--blue)'}
      className={`${styles.team} ${styles[side]}`}
    >
      <div className={styles.teamName}>{name}</div>
      <div className={styles.teamPoints}>
        {Array.from({ length: maxPoints }, (_, i) => (
          <div key={i} className={`${styles.point} ${i < points ? styles.filled : ''}`} />
        ))}
      </div>
    </RetroDialog>
  );
};
