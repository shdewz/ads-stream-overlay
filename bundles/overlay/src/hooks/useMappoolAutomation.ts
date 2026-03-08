import { useCallback, useEffect, useRef } from 'react';
import { useBeatmaps } from './useBeatmaps';
import { useMappoolControl } from './useMappoolControl';
import { useMappoolState } from './useMappoolState';
import { useScene } from './useScene';
import { useTosu } from './useTosu';
import { TourneyState } from '@/types/tosu';

const ADVANCE_DELAY_MS = 8000;

/**
 * Encapsulates autopick and autoadvance logic.
 * Returns a `handlePick` function to use in place of raw `pickMap` for manual picks.
 */
export const useMappoolAutomation = () => {
  const { data } = useTosu();
  const { setScene } = useScene();
  const { control, setCurrentPicker } = useMappoolControl();
  const poolData = useBeatmaps();
  const { state, pickMap } = useMappoolState();

  // Refs so effects always see the latest values without re-registering
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

  const handlePick = useCallback(
    (identifier: string, team: 'red' | 'blue') => {
      pickMap(identifier, team);
      setCurrentPicker(team === 'red' ? 'blue' : 'red');
      scheduleAdvance();
    },
    [pickMap, setCurrentPicker, scheduleAdvance]
  );

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

  return { handlePick };
};
