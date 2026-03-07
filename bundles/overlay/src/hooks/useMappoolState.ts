import { useState, useEffect, useRef, useCallback } from 'react';
import type { MappoolPickState, MapTeam } from '@/types/beatmap';

export interface UseMappoolStateResult {
  state: MappoolPickState;
  pickMap: (identifier: string, team: MapTeam) => void;
  banMap: (identifier: string, team: MapTeam) => void;
  resetMap: (identifier: string) => void;
  resetMappool: () => void;
}

export const useMappoolState = (): UseMappoolStateResult => {
  const repRef = useRef(
    nodecg.Replicant<MappoolPickState>('mappoolState', { defaultValue: {} })
  );
  const [state, setState] = useState<MappoolPickState>({});

  useEffect(() => {
    const rep = repRef.current;
    const handler = (newVal: MappoolPickState) => setState(newVal ?? {});
    rep.on('change', handler);
    return () => {
      rep.removeListener('change', handler);
    };
  }, []);

  const pickMap = useCallback((identifier: string, team: MapTeam) => {
    repRef.current.value = {
      ...repRef.current.value,
      [identifier]: { state: 'picked', team },
    };
  }, []);

  const banMap = useCallback((identifier: string, team: MapTeam) => {
    repRef.current.value = {
      ...repRef.current.value,
      [identifier]: { state: 'banned', team },
    };
  }, []);

  const resetMap = useCallback((identifier: string) => {
    const next = { ...repRef.current.value };
    delete next[identifier];
    repRef.current.value = next;
  }, []);

  const resetMappool = useCallback(() => {
    repRef.current.value = {};
  }, []);

  return { state, pickMap, banMap, resetMap, resetMappool };
};
