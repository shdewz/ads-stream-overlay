import { useState, useEffect, useRef } from 'react';
import type { MappoolData } from '@/types/beatmap';

export const useBeatmaps = (): MappoolData | null => {
  const repRef = useRef(nodecg.Replicant<MappoolData | null>('beatmaps', { defaultValue: null }));
  const [data, setData] = useState<MappoolData | null>(null);

  useEffect(() => {
    const rep = repRef.current;
    const handler = (newVal: MappoolData | null) => setData(newVal ?? null);
    rep.on('change', handler);
    return () => {
      rep.removeListener('change', handler);
    };
  }, []);

  return data;
};
