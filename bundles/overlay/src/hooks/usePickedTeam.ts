import { useState, useEffect, useRef } from 'react';
import type { MappoolPickState, MapTeam } from '@/types/beatmap';

/**
 * Returns the team that picked the given map identifier, or null if it hasn't
 * been picked (or no identifier is provided).
 */
export const usePickedTeam = (identifier: string | undefined): MapTeam => {
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

  if (!identifier) return null;
  const entry = state[identifier];
  return entry?.state === 'picked' ? (entry.team ?? null) : null;
};
