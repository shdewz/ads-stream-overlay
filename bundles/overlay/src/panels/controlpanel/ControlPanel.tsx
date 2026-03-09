import { useBeatmaps } from '@/hooks/useBeatmaps';
import { useMappoolAutomation } from '@/hooks/useMappoolAutomation';
import { useMappoolControl } from '@/hooks/useMappoolControl';
import { useMappoolState } from '@/hooks/useMappoolState';
import { useScene } from '@/hooks/useScene';
import { useTosu } from '@/hooks/useTosu';
import { MapRow } from './MapRow';
import styles from './MappoolPanel.module.css';

const MOD_ORDER = ['NM', 'HD', 'HR', 'DT', 'FM', 'TB'];

export const ControlPanel = () => {
  const poolData = useBeatmaps();
  const { state, banMap, resetMap, resetMappool } = useMappoolState();
  const { data } = useTosu();
  const { control, setAutopick, setAutoadvance, setCurrentPicker } = useMappoolControl();
  const { handlePick } = useMappoolAutomation();
  const { scene, setScene } = useScene();

  const redName = data?.tourney?.team.left || 'Red';
  const blueName = data?.tourney?.team.right || 'Blue';

  if (!poolData) {
    return <div className={styles.empty}>No mappool loaded. Edit beatmaps.json to populate.</div>;
  }

  const grouped = MOD_ORDER.reduce<Record<string, typeof poolData.beatmaps>>((acc, mod) => {
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
        <div className={styles.toolbarRow}>
          <span className={styles.teams}>
            <span className={styles.teamRed}>{redName}</span>
            {' vs '}
            <span className={styles.teamBlue}>{blueName}</span>
          </span>
        </div>
        <div className={styles.toolbarGroup}>
          <span className={styles.toolbarSubtitle}>Scene controls</span>
          <div className={styles.toolbarRow}>
            <div className={styles.pickerToggle}>
              <button
                className={`${styles.btn} ${scene === 'gameplay' ? styles.btnActive : ''}`}
                onClick={() => setScene('gameplay')}
              >
                Gameplay
              </button>
              <button
                className={`${styles.btn} ${scene === 'mappool' ? styles.btnActive : ''}`}
                onClick={() => setScene('mappool')}
              >
                Mappool
              </button>
            </div>
          </div>
        </div>
        <div className={styles.toolbarGroup}>
          <span className={styles.toolbarSubtitle}>Mappool controls</span>
          <div className={styles.toolbarRow}>
            <div className={styles.toolbarControls}>
              <button
                className={`${styles.btn} ${control.autopickEnabled ? styles.btnActive : ''}`}
                onClick={() => setAutopick(!control.autopickEnabled)}
              >
                Autopick
              </button>
              <div className={styles.pickerToggle}>
                <button
                  className={`${styles.btn} ${control.currentPicker === 'red' ? styles.btnRed : ''}`}
                  onClick={() => setCurrentPicker('red')}
                  title="Set next pick to Red"
                >
                  R pick
                </button>
                <button
                  className={`${styles.btn} ${control.currentPicker === 'blue' ? styles.btnBlue : ''}`}
                  onClick={() => setCurrentPicker('blue')}
                  title="Set next pick to Blue"
                >
                  B pick
                </button>
              </div>
              <button
                className={`${styles.btn} ${control.autoadvanceEnabled ? styles.btnActive : ''}`}
                onClick={() => setAutoadvance(!control.autoadvanceEnabled)}
              >
                Autoadvance
              </button>
              <button className={`${styles.btn} ${styles.btnReset}`} onClick={resetMappool}>
                Reset All
              </button>
            </div>
          </div>
        </div>
      </div>
      {Object.entries(grouped).map(([mod, maps]) => (
        <div key={mod} className={`${styles.modGroup}`}>
          <div
            className={`${styles.modHeader} ${styles[mod.toLowerCase() as keyof typeof styles] ?? ''}`}
          >
            {mod}
          </div>
          {maps.map((bm) => (
            <MapRow
              key={bm.identifier}
              beatmap={bm}
              pickState={state[bm.identifier]}
              redName={redName}
              blueName={blueName}
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
