import { useTosu } from '@/hooks/useTosu';
import { useCurrentMap } from '@/hooks/useCurrentMap';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import styles from './styles/TeamScores.module.css';

const TEAM_SIZE = 3;

const formatScore = (n: number) => n.toLocaleString('en-US');

export const TeamScores = () => {
  const { data } = useTosu();
  const currentMap = useCurrentMap(data?.beatmap?.id, data?.beatmap?.checksum);

  const isFm = currentMap?.mods?.toUpperCase().includes('FM') ?? false;
  const ezMult = currentMap?.ez_mult ?? 1;

  const clients = data?.tourney?.clients ?? [];

  const sumTeam = (a: number, b: number) =>
    clients.slice(a, b).reduce((sum, c) => {
      let score = c?.play?.score ?? 0;
      if (isFm && c?.play?.mods?.name?.toUpperCase().includes('EZ')) {
        score *= ezMult;
      }
      return sum + score;
    }, 0);

  const leftRaw = sumTeam(0, TEAM_SIZE);
  const rightRaw = sumTeam(TEAM_SIZE, TEAM_SIZE * 2);

  const left = useAnimatedNumber(leftRaw);
  const right = useAnimatedNumber(rightRaw);

  const diff = Math.abs(left - right);
  const barWidth = Math.min(25, Math.pow(diff / 1200000, 0.7) * 100);

  const leftLeads = left > right;
  const rightLeads = right > left;

  return (
    <div className={styles.wrapper}>
      <div className={styles.leadBarTrack}>
        <div className={styles.leadBarLeft} style={{ width: leftLeads ? `${barWidth}%` : '0%' }} />
        <div
          className={styles.leadBarRight}
          style={{ width: rightLeads ? `${barWidth}%` : '0%' }}
        />
      </div>
      <div className={styles.scores}>
        <span
          className={`${styles.score} ${styles.scoreRed}${leftLeads ? ` ${styles.winning}` : ''}`}
        >
          {formatScore(left)}
        </span>
        <span
          className={`${styles.score} ${styles.scoreBlue}${rightLeads ? ` ${styles.winning}` : ''}`}
        >
          {formatScore(right)}
        </span>
      </div>
    </div>
  );
};
