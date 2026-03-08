import { useBeatmaps } from '@/hooks/useBeatmaps';
import { useMappoolState } from '@/hooks/useMappoolState';
import { useTosu } from '@/hooks/useTosu';
import { MapCard } from './MapCard';
import { ControlPanel } from '@/components/ControlPanel';
import { MappoolControls } from '@/components/MappoolControls';
import styles from './styles/Mappool.module.css';

export const Mappool = () => {
  const poolData = useBeatmaps();
  const { state, pickMap, banMap, resetMap } = useMappoolState();
  const { data } = useTosu();
  const redName = data?.tourney?.team.left || 'Red Team';
  const blueName = data?.tourney?.team.right || 'Blue Team';

  if (!poolData) return null;

  const byMod = poolData.beatmaps.reduce<Record<string, typeof poolData.beatmaps>>((acc, bm) => {
    (acc[bm.mods] ??= []).push(bm);
    return acc;
  }, {});

  return (
    <div className={styles.root}>
      <ControlPanel>
        <MappoolControls />
      </ControlPanel>
      {Object.entries(byMod).map(([mod, maps]) => (
        <div key={mod} className={styles.modGroup}>
          {maps.map((bm) => (
            <MapCard
              key={bm.identifier}
              beatmap={bm}
              pickState={state[bm.identifier]}
              redName={redName}
              blueName={blueName}
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
