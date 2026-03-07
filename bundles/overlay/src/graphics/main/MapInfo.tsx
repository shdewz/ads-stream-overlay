import { useState, useEffect } from 'react';
import { useTosu } from '@/hooks/useTosu';
import { useCurrentMap } from '@/hooks/useCurrentMap';
import { usePickedTeam } from '@/hooks/usePickedTeam';
import styles from './styles/MapInfo.module.css';

const formatStat = (n: number | undefined, dp = 2) => (n != null ? n.toFixed(dp) : '—');

const fmtLen = (ms: number) => {
  const s = Math.trunc(ms / 1000);
  return `${Math.trunc(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const formatBpm = ({ min, max, common }: { min: number; max: number; common: number }) =>
  min === max ? String(Math.round(common)) : `${Math.round(min)}-${Math.round(max)}`;

export const MapInfo = () => {
  const { data } = useTosu();
  const currentMap = useCurrentMap(data?.beatmap?.id, data?.beatmap?.checksum);
  const pickedTeam = usePickedTeam(currentMap?.identifier);

  const statsColor =
    pickedTeam === 'red' ? 'var(--red)' : pickedTeam === 'blue' ? 'var(--blue)' : 'var(--red)';

  const beatmap = data?.beatmap;
  const stats = beatmap?.stats;
  const time = beatmap?.time;

  const title = beatmap ? `${beatmap.artist} - ${beatmap.title}` : '—';
  const sub = beatmap
    ? `[${beatmap.version}] mapped by ${currentMap?.mapper ?? beatmap.mapper}`
    : '';

  const sr = currentMap?.sr ?? stats?.stars?.total;
  const cs = stats?.cs?.converted;
  const ar = stats?.ar?.converted;
  const od = stats?.od?.converted;
  const bpm = stats?.bpm;
  const lengthMs = time != null ? time.lastObject - time.firstObject : undefined;

  const bgFile = data?.files?.background;
  const bgFolder = data?.folders?.beatmap;
  const localUrl =
    bgFolder && bgFile
      ? `http://localhost:24050/Songs/${bgFolder}/${bgFile}`
          .replace(/#/g, '%23')
          .replace(/%/g, '%25')
          .replace(/\\/g, '/')
      : undefined;
  const onlineUrl = currentMap?.beatmapset_id
    ? `https://assets.ppy.sh/beatmaps/${currentMap.beatmapset_id}/covers/cover.jpg`
    : undefined;

  const [bgUrl, setBgUrl] = useState<string | undefined>(localUrl);

  useEffect(() => {
    if (!localUrl) {
      setBgUrl(onlineUrl);
      return;
    }
    setBgUrl(localUrl);
    const img = new Image();
    img.src = localUrl;
    img.onerror = () => setBgUrl(onlineUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localUrl]);

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <div
          className={styles.titleBg}
          style={bgUrl ? { backgroundImage: `url('${bgUrl}')` } : undefined}
        />
        <div className={styles.titleContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.sub}>{sub}</div>
        </div>
      </div>
      <div className={styles.titleAccent} style={{ backgroundColor: statsColor }} />
      <div className={styles.statsBlock} style={{ backgroundColor: statsColor }}>
        <div className={styles.stat}>
          <span className={styles.label}>SR</span>
          {formatStat(sr)}
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>AR</span>
          {formatStat(ar, 1)}
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>OD</span>
          {formatStat(od, 1)}
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>CS</span>
          {formatStat(cs, 1)}
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>BPM</span>
          {bpm ? formatBpm(bpm) : '—'}
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>LEN</span>
          {lengthMs != null ? fmtLen(lengthMs) : '--:--'}
        </div>
      </div>
    </div>
  );
};
