import { useBeatmaps } from '@/hooks/useBeatmaps';
import { useMappoolState } from '@/hooks/useMappoolState';
import { useTosu } from '@/hooks/useTosu';
import type { MappoolBeatmap } from '@/types/beatmap';
import type { MapPickState } from '@/types/beatmap';
import styles from './MappoolPanel.module.css';

const MOD_ORDER = ['NM', 'HD', 'HR', 'DT', 'FM', 'TB'];

const modClass: Record<string, string> = {
  NM: styles.nm,
  HD: styles.hd,
  HR: styles.hr,
  DT: styles.dt,
  FM: styles.fm,
  TB: styles.tb,
};

interface MapRowProps {
  beatmap: MappoolBeatmap;
  pickState: MapPickState | undefined;
  redName: string;
  blueNname: string;
  onPick: (team: 'red' | 'blue') => void;
  onBan: (team: 'red' | 'blue') => void;
  onReset: () => void;
}

const MapRow = ({
  beatmap,
  pickState,
  redName,
  blueNname,
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
      ? `Picked by ${team === 'red' ? redName : blueNname}`
      : s === 'banned'
        ? `Banned by ${team === 'red' ? redName : blueNname}`
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
          {beatmap.artist} – {beatmap.title}
        </div>
        <div className={styles.mapDiff}>[{beatmap.difficulty}]</div>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnRed}`}
          title={`Pick for ${redName}`}
          onClick={() => onPick('red')}
        >
          R Pck
        </button>
        <button
          className={`${styles.btn} ${styles.btnBlue}`}
          title={`Pick for ${blueNname}`}
          onClick={() => onPick('blue')}
        >
          B Pck
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
          title={`Ban for ${blueNname}`}
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

export const MappoolPanel = () => {
  const poolData = useBeatmaps();
  const { state, pickMap, banMap, resetMap, resetMappool } = useMappoolState();
  const { data } = useTosu();

  const redName = data?.tourney?.team.left || 'Red';
  const blueName = data?.tourney?.team.right || 'Blue';

  if (!poolData) {
    return <div className={styles.empty}>No mappool loaded. Edit beatmaps.json to populate.</div>;
  }

  // Group by mod, using defined order
  const grouped = MOD_ORDER.reduce<Record<string, MappoolBeatmap[]>>((acc, mod) => {
    const maps = poolData.beatmaps.filter((b) => b.mods.toUpperCase() === mod);
    if (maps.length) acc[mod] = maps;
    return acc;
  }, {});

  // Any mods not in MOD_ORDER go at the end
  poolData.beatmaps.forEach((b) => {
    const mod = b.mods.toUpperCase();
    if (!grouped[mod]) grouped[mod] = [];
    if (!grouped[mod].includes(b)) grouped[mod].push(b);
  });

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <span className={styles.teams}>
          <span className={styles.teamRed}>{redName}</span>
          {' vs '}
          <span className={styles.teamBlue}>{blueName}</span>
        </span>
        <button className={`${styles.btn} ${styles.btnReset}`} onClick={resetMappool}>
          Reset All
        </button>
      </div>
      {Object.entries(grouped).map(([mod, maps]) => (
        <div key={mod} className={styles.modGroup}>
          <div className={`${styles.modHeader} ${modClass[mod] ?? ''}`}>{mod}</div>
          {maps.map((bm) => (
            <MapRow
              key={bm.identifier}
              beatmap={bm}
              pickState={state[bm.identifier]}
              redName={redName}
              blueNname={blueName}
              onPick={(team) => pickMap(bm.identifier, team)}
              onBan={(team) => banMap(bm.identifier, team)}
              onReset={() => resetMap(bm.identifier)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
