import { TeamPanel } from './TeamPanel';
import { Logo } from '@/components/Logo';
import { useTosu } from '@/hooks/useTosu';
import { useBeatmaps } from '@/hooks/useBeatmaps';
import styles from './styles/Header.module.css';

export const Header = () => {
  const { data } = useTosu();
  const poolData = useBeatmaps();

  const stageName = poolData?.stage?.toUpperCase() ?? 'GRAND FINALS';
  const division = poolData?.division != null ? `DIVISION ${poolData.division}` : 'DIVISION 1';

  const tourney = data?.tourney;
  const bestOf = tourney?.bestOF || 11;
  const maxPoints = Math.max(1, Math.ceil(bestOf / 2));

  const red = {
    name: tourney?.team.left || 'RED TEAM',
    points: tourney?.points.left ?? 0,
  };
  const blue = {
    name: tourney?.team.right || 'BLUE TEAM',
    points: tourney?.points.right ?? 0,
  };

  return (
    <header className={styles.header}>
      <TeamPanel side="red" name={red.name} points={red.points} maxPoints={maxPoints} />
      <div className={styles.middle}>
        <div className={styles.middleTop}>
          <Logo division={division} size="86px" />
        </div>
        <span className={styles.stageName}>{stageName}</span>
      </div>
      <TeamPanel side="blue" name={blue.name} points={blue.points} maxPoints={maxPoints} />
    </header>
  );
};
