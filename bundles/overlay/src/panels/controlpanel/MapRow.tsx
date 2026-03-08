import type { MappoolBeatmap, MapPickState } from '@/types/beatmap';
import styles from './MappoolPanel.module.css';

const modClass: Record<string, string> = {
  NM: styles.nm,
  HD: styles.hd,
  HR: styles.hr,
  DT: styles.dt,
  FM: styles.fm,
  TB: styles.tb,
};

export interface MapRowProps {
  beatmap: MappoolBeatmap;
  pickState: MapPickState | undefined;
  redName: string;
  blueName: string;
  onPick: (team: 'red' | 'blue') => void;
  onBan: (team: 'red' | 'blue') => void;
  onReset: () => void;
}

export const MapRow = ({
  beatmap,
  pickState,
  redName,
  blueName,
  onPick,
  onBan,
  onReset,
}: MapRowProps) => {
  const s = pickState?.state ?? 'none';
  const team = pickState?.team ?? null;

  const stateColor =
    s === 'picked' && team === 'red'
      ? '#e05070'
      : s === 'picked' && team === 'blue'
        ? '#6680e0'
        : s === 'banned' && team === 'red'
          ? '#7a2838'
          : s === 'banned' && team === 'blue'
            ? '#2e3870'
            : null;

  const stateTitle =
    s === 'picked'
      ? `Picked by ${team === 'red' ? redName : blueName}`
      : s === 'banned'
        ? `Banned by ${team === 'red' ? redName : blueName}`
        : undefined;

  const rowClass = [
    styles.row,
    s === 'picked' && team === 'red' ? styles.pickedRed : '',
    s === 'picked' && team === 'blue' ? styles.pickedBlue : '',
    s === 'banned' ? styles.banned : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rowClass}>
      <div className={`${styles.badge} ${modClass[beatmap.mods] ?? ''}`}>
        {beatmap.identifier.toUpperCase()}
      </div>
      {stateColor ? (
        <div
          className={styles.stateIndicator}
          style={{ background: stateColor }}
          title={stateTitle}
        />
      ) : (
        <div className={styles.stateIndicator} />
      )}
      <div className={styles.meta}>
        <div className={styles.mapTitle}>
          {beatmap.artist} - {beatmap.title}
        </div>
        <div className={styles.mapDiff}>[{beatmap.difficulty}]</div>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnRed}`}
          title={`Pick for ${redName}`}
          onClick={() => onPick('red')}
        >
          R Pick
        </button>
        <button
          className={`${styles.btn} ${styles.btnBlue}`}
          title={`Pick for ${blueName}`}
          onClick={() => onPick('blue')}
        >
          B Pick
        </button>
        <button
          className={`${styles.btn} ${styles.btnBan}`}
          title={`Ban for ${redName}`}
          onClick={() => onBan('red')}
        >
          R Ban
        </button>
        <button
          className={`${styles.btn} ${styles.btnBan}`}
          title={`Ban for ${blueName}`}
          onClick={() => onBan('blue')}
        >
          B Ban
        </button>
        <button
          className={`${styles.btn} ${styles.btnReset}`}
          title="Reset"
          onClick={onReset}
          disabled={s === 'none'}
        >
          ↺
        </button>
      </div>
    </div>
  );
};
