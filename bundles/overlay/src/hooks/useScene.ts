import { useState, useEffect, useRef, useCallback } from 'react';

export type Scene = 'gameplay' | 'mappool';

const REPLICANT_NAME = 'scene';

export interface UseSceneResult {
  scene: Scene;
  /** True once the replicant has fired its first 'change' event. */
  ready: boolean;
  setScene: (scene: Scene) => void;
}

/**
 * Returns the currently active scene and a setter that writes to the Replicant.
 */
export const useScene = (): UseSceneResult => {
  const repRef = useRef(nodecg.Replicant<Scene>(REPLICANT_NAME, { defaultValue: 'gameplay' }));

  const [scene, setSceneState] = useState<Scene>('gameplay');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rep = repRef.current;
    const handler = (newVal: Scene) => {
      setSceneState(newVal);
      setReady(true);
    };
    rep.on('change', handler);
    return () => {
      rep.removeListener('change', handler);
    };
  }, []);

  const setScene = useCallback((newScene: Scene) => {
    repRef.current.value = newScene;
  }, []);

  return { scene, ready, setScene };
};
