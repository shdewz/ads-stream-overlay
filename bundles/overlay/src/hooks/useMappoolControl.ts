import { useState, useEffect, useRef, useCallback } from 'react';

export interface MappoolControl {
  autopickEnabled: boolean;
  autoadvanceEnabled: boolean;
  currentPicker: 'red' | 'blue';
}

const DEFAULT: MappoolControl = {
  autopickEnabled: false,
  autoadvanceEnabled: false,
  currentPicker: 'red',
};

export interface UseMappoolControlResult {
  control: MappoolControl;
  setAutopick: (enabled: boolean) => void;
  setAutoadvance: (enabled: boolean) => void;
  setCurrentPicker: (picker: 'red' | 'blue') => void;
}

export const useMappoolControl = (): UseMappoolControlResult => {
  const repRef = useRef(
    nodecg.Replicant<MappoolControl>('mappoolControl', { defaultValue: DEFAULT })
  );
  const [control, setControl] = useState<MappoolControl>(DEFAULT);

  useEffect(() => {
    const rep = repRef.current;
    const handler = (newVal: MappoolControl) => setControl(newVal ?? DEFAULT);
    rep.on('change', handler);
    return () => {
      rep.removeListener('change', handler);
    };
  }, []);

  const setAutopick = useCallback((enabled: boolean) => {
    repRef.current.value = { ...repRef.current.value!, autopickEnabled: enabled };
  }, []);

  const setAutoadvance = useCallback((enabled: boolean) => {
    repRef.current.value = { ...repRef.current.value!, autoadvanceEnabled: enabled };
  }, []);

  const setCurrentPicker = useCallback((picker: 'red' | 'blue') => {
    repRef.current.value = { ...repRef.current.value!, currentPicker: picker };
  }, []);

  return { control, setAutopick, setAutoadvance, setCurrentPicker };
};
