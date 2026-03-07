import { useState, useEffect, useRef } from 'react';

export interface ComingUpData {
  time: number;
  red_team: string;
  blue_team: string;
  showcase: boolean;
}

export const useComingUp = (): ComingUpData | null => {
  const repRef = useRef(
    nodecg.Replicant<ComingUpData | null>('comingUp', { defaultValue: null })
  );
  const [data, setData] = useState<ComingUpData | null>(null);

  useEffect(() => {
    const rep = repRef.current;
    const handler = (newVal: ComingUpData | null) => setData(newVal ?? null);
    rep.on('change', handler);
    return () => {
      rep.removeListener('change', handler);
    };
  }, []);

  return data;
};
