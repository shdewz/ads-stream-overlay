import { ControlPanel, ControlPanelGroup } from '@/components/ControlPanel';
import { Footer } from './Footer';
import { Header } from './Header';
import { useScene } from '@/hooks/useScene';
import { useMappoolState } from '@/hooks/useMappoolState';
import { useState, useEffect, useRef } from 'react';
import styles from './styles/App.module.css';
import panelStyles from '@/components/styles/ControlPanel.module.css';

type MappoolState = 'hidden' | 'visible' | 'visible-instant' | 'fading-out';

export const App = () => {
  const { scene, ready, setScene } = useScene();
  const { resetMappool } = useMappoolState();
  const isMappool = scene === 'mappool';

  const [mappoolState, setMappoolState] = useState<MappoolState>('hidden');
  const prevIsMappoolRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (prevIsMappoolRef.current === null) {
      setMappoolState(isMappool ? 'visible-instant' : 'hidden');
      prevIsMappoolRef.current = isMappool;
      return;
    }
    if (isMappool !== prevIsMappoolRef.current) {
      if (isMappool) {
        setMappoolState('visible');
      } else {
        setMappoolState((prev) =>
          prev === 'visible' || prev === 'visible-instant' ? 'fading-out' : prev
        );
      }
      prevIsMappoolRef.current = isMappool;
    }
  }, [isMappool, ready]);

  if (!ready) return null;

  const mappoolAnimClass: Partial<Record<MappoolState, string>> = {
    hidden: styles.mappoolHidden,
    'fading-out': styles.fadeOut,
    visible: styles.fadeIn,
  };

  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.gameplayArea}>
        <div
          className={`${styles.gameplayContent} ${styles.gameplayContentFilled} ${mappoolAnimClass[mappoolState] ?? ''}`}
          onAnimationEnd={
            mappoolState === 'fading-out' ? () => setMappoolState('hidden') : undefined
          }
        >
          <iframe
            src="/bundles/overlay/graphics/mappool/index.html"
            className={styles.mappoolFrame}
          />
        </div>
      </div>
      <Footer />
      <ControlPanel>
        <ControlPanelGroup title="Scene controls">
          <button
            onClick={() => setScene('gameplay')}
            className={!isMappool ? panelStyles.active : undefined}
          >
            Gameplay
          </button>
          <button
            onClick={() => setScene('mappool')}
            className={isMappool ? panelStyles.active : undefined}
          >
            Mappool
          </button>
        </ControlPanelGroup>
        <ControlPanelGroup title="Mappool controls">
          <button onClick={resetMappool}>Reset Mappool</button>
        </ControlPanelGroup>
      </ControlPanel>
    </div>
  );
};
