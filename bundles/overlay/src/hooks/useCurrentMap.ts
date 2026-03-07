import { useBeatmaps } from './useBeatmaps';
import type { MappoolBeatmap } from '@/types/beatmap';

/**
 * Returns the beatmap entry from beatmaps.json that matches the
 * beatmap currently loaded
 *
 * @param beatmapId - 'data.beatmap.id' from tosu
 * @param checksum - 'data.beatmap.checksum' from tosu (fallback)
 */
export const useCurrentMap = (
  beatmapId: number | undefined,
  checksum: string | undefined
): MappoolBeatmap | null => {
  const beatmaps = useBeatmaps();
  if (!beatmaps || !beatmapId) return null;
  return (
    beatmaps.beatmaps.find(
      (b) =>
        b.beatmap_id === beatmapId ||
        (checksum != null && checksum !== '' && b.checksum === checksum)
    ) ?? null
  );
};
