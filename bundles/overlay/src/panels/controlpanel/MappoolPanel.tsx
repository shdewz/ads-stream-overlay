import { useCallback, useEffect, useRef } from 'react';
import { useBeatmaps } from '@/hooks/useBeatmaps';
import { useMappoolControl } from '@/hooks/useMappoolControl';
import { useMappoolState } from '@/hooks/useMappoolState';
import { useScene } from '@/hooks/useScene';
import { useTosu } from '@/hooks/useTosu';
import type { MappoolBeatmap } from '@/types/beatmap';
import type { MapPickState } from '@/types/beatmap';
import { TourneyState } from '@/types/tosu';
import styles from './MappoolPanel.module.css';

const ADVANCE_DELAY_MS = 8000;

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
          title={`Pick for ${blueNname}`}
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
  const { setScene } = useScene();
  const { control, setAutopick, setAutoadvance, setCurrentPicker } = useMappoolControl();

  const redName = data?.tourney?.team.left || 'Red';
  const blueName = data?.tourney?.team.right || 'Blue';

  // Refs for latest values needed inside effects without stale closures
  const controlRef = useRef(control);
  useEffect(() => {
    controlRef.current = control;
  }, [control]);
  const poolDataRef = useRef(poolData);
  useEffect(() => {
    poolDataRef.current = poolData;
  }, [poolData]);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Autoadvance timer
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    },
    []
  );

  const scheduleAdvance = useCallback(() => {
    if (!controlRef.current.autoadvanceEnabled) return;
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      setScene('gameplay');
      advanceTimerRef.current = null;
    }, ADVANCE_DELAY_MS);
  }, [setScene]);

  // Manual pick: pick the map, swap currentPicker, schedule scene advance
  const handlePick = useCallback(
    (identifier: string, team: 'red' | 'blue') => {
      pickMap(identifier, team);
      setCurrentPicker(team === 'red' ? 'blue' : 'red');
      scheduleAdvance();
    },
    [pickMap, setCurrentPicker, scheduleAdvance]
  );

  // Autopick: watch beatmap id from tosu
  const prevBeatmapIdRef = useRef<number | null>(null);
  const beatmapId = data?.beatmap?.id;
  useEffect(() => {
    if (!beatmapId) return;
    const prev = prevBeatmapIdRef.current;
    prevBeatmapIdRef.current = beatmapId;
    if (!prev || prev === beatmapId) return;

    if (!controlRef.current.autopickEnabled) return;
    const pool = poolDataRef.current;
    if (!pool) return;
    const match = pool.beatmaps.find((b) => b.beatmap_id === beatmapId);
    if (!match || stateRef.current[match.identifier]?.state === 'picked') return;

    const { currentPicker } = controlRef.current;
    pickMap(match.identifier, currentPicker);
    setCurrentPicker(currentPicker === 'red' ? 'blue' : 'red');
    scheduleAdvance();
  }, [beatmapId, pickMap, setCurrentPicker, scheduleAdvance]);

  // Autoadvance back to mappool: Ranking → Idle
  const prevIpcStateRef = useRef<number | null>(null);
  const ipcState = data?.tourney?.ipcState;
  useEffect(() => {
    if (ipcState == null) return;
    const prev = prevIpcStateRef.current;
    prevIpcStateRef.current = ipcState;
    if (!controlRef.current.autoadvanceEnabled) return;
    if (prev === TourneyState.Ranking && ipcState === TourneyState.Idle) {
      setScene('mappool');
    }
  }, [ipcState, setScene]);

  if (!poolData) {
    return <div className={styles.empty}>No mappool loaded. Edit beatmaps.json to populate.</div>;
  }

  const grouped = MOD_ORDER.reduce<Record<string, MappoolBeatmap[]>>((acc, mod) => {
    const maps = poolData.beatmaps.filter((b) => b.mods.toUpperCase() === mod);
    if (maps.length) acc[mod] = maps;
    return acc;
  }, {});

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
        <div className={styles.toolbarControls}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={control.autopickEnabled}
              onChange={(e) => setAutopick(e.target.checked)}
            />
            Autopick
          </label>
          <div className={styles.pickerToggle}>
            <button
              className={`${styles.btn} ${control.currentPicker === 'red' ? styles.btnRed : ''}`}
              onClick={() => setCurrentPicker('red')}
              title="Set next pick to Red"
            >
              R
            </button>
            <button
              className={`${styles.btn} ${control.currentPicker === 'blue' ? styles.btnBlue : ''}`}
              onClick={() => setCurrentPicker('blue')}
              title="Set next pick to Blue"
            >
              B
            </button>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={control.autoadvanceEnabled}
              onChange={(e) => setAutoadvance(e.target.checked)}
            />
            Autoadvance
          </label>
          <button className={`${styles.btn} ${styles.btnReset}`} onClick={resetMappool}>
            Reset All
          </button>
        </div>
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
              onPick={(team) => handlePick(bm.identifier, team)}
              onBan={(team) => banMap(bm.identifier, team)}
              onReset={() => resetMap(bm.identifier)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
