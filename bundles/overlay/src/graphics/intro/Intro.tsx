import { useState, useEffect } from 'react';
import { useBeatmaps } from '@/hooks/useBeatmaps';
import { useComingUp } from '@/hooks/useComingUp';
import { Logo } from '@/components/Logo';
import { RetroDialog } from '@/components/RetroDialog';
import { Taskbar } from '@/components/Taskbar';
import styles from './styles/Intro.module.css';

const DIVISION = 'DIVISION 1';

const useCountdown = (targetMs: number | null): number | null => {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (targetMs === null) return;
    const tick = () => setRemaining(Math.max(0, targetMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return remaining;
};

const formatCountdown = (ms: number): string => {
  const totalSecs = Math.floor(ms / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return days > 0 ? `${days}d ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
};

export const Intro = () => {
  const beatmaps = useBeatmaps();
  const comingUp = useComingUp();
  const remaining = useCountdown(comingUp?.time ?? null);

  const stage = beatmaps?.stage ?? '';
  const dialogTitle = stage
    ? stage.toUpperCase().replace(/\s+/g, '_') + '_INTRO.TXT'
    : 'COMING_UP.TXT';

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.logoBlock}>
          <Logo division={DIVISION} size="156px" />
        </div>
        <RetroDialog title={dialogTitle} className={styles.dialog}>
          <div className={styles.dialogBody}>
            <span className={styles.startingSoon}>STARTING SOON</span>
            {comingUp &&
              (comingUp.showcase ? (
                <span className={styles.showcaseText}>{stage} Mappool Showcase</span>
              ) : (
                <div className={styles.teams}>
                  <span className={styles.teamName}>{comingUp.red_team}</span>
                  <span className={styles.vs}>vs</span>
                  <span className={styles.teamName}>{comingUp.blue_team}</span>
                </div>
              ))}
            {remaining !== null && (
              <div className={styles.countdown}>{formatCountdown(remaining)}</div>
            )}
          </div>
        </RetroDialog>
      </div>
      <Taskbar activeWindow={dialogTitle} />
    </div>
  );
};
