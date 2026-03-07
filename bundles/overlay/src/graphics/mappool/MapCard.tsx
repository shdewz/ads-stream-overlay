import type { MappoolBeatmap } from '@/types/beatmap';
import type { MapPickState } from '@/types/beatmap';
import styles from './styles/MapCard.module.css';

interface MapCardProps {
  beatmap: MappoolBeatmap;
  pickState?: MapPickState;
  redName?: string;
  blueName?: string;
  onPick?: (team: 'red' | 'blue') => void;
  onBan?: (team: 'red' | 'blue') => void;
  onReset?: () => void;
}

export const MapCard = ({
  beatmap,
  pickState,
  redName = 'Red',
  blueName = 'Blue',
  onPick,
  onBan,
  onReset,
}: MapCardProps) => {
  const state = pickState?.state ?? 'none';
  const team = pickState?.team ?? null;

  const mod = beatmap.mods.toLowerCase();
  const isTB = beatmap.mods.includes('TB');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.shiftKey) {
      onReset?.();
      return;
    }
    const t = e.button === 2 ? 'blue' : 'red';
    if (e.ctrlKey) onBan?.(t);
    else onPick?.(t);
  };

  const teamName = team === 'red' ? redName : blueName;
  const pickedByLabel =
    state === 'picked'
      ? isTB
        ? 'Tiebreaker'
        : `Picked by ${teamName}`
      : state === 'banned'
        ? `Banned by ${teamName}`
        : null;

  return (
    <div
      className={[
        styles.map,
        state !== 'none' ? styles[state] : '',
        team && state !== 'none' ? styles[team] : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseDown={handleClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={[styles.titleBar, styles[mod], state === 'picked' && team ? styles[team] : '']
          .filter(Boolean)
          .join(' ')}
      >
        <div className={`${styles.mapIdentifier}`}>{`${beatmap.identifier.toUpperCase()}.MP4`}</div>
        {pickedByLabel && (
          <div
            className={`${styles.label} ${state !== 'none' ? styles[state] : ''} ${team ? styles[team] : ''}`}
          >
            {pickedByLabel}
          </div>
        )}
      </div>

      <div className={styles.meta}>
        <div className={styles.metaContent}>
          <div className={styles.title}>
            {beatmap.artist} – {beatmap.title}
          </div>
          <div className={styles.bottom}>
            <span className={styles.diff}>{beatmap.difficulty}</span>
            <span className={styles.mapper}>by {beatmap.mapper}</span>
          </div>
        </div>
        <div
          className={styles.bg}
          style={{
            backgroundImage: `url('https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover.jpg')`,
          }}
        />
      </div>
    </div>
  );
};
