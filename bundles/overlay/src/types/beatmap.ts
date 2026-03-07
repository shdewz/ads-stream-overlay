export interface MappoolBeatmap {
  beatmap_id: number;
  beatmapset_id: number;
  identifier: string;
  mods: string;
  sr: number;
  bpm: number;
  artist: string;
  title: string;
  difficulty: string;
  mapper: string;
  custom?: boolean;
  original?: boolean;
  checksum?: string | null;
  ez_mult?: number;
}

export interface MappoolData {
  stage: string;
  beatmaps: MappoolBeatmap[];
}

export type MapState = 'none' | 'picked' | 'banned';
export type MapTeam = 'red' | 'blue' | null;

export interface MapPickState {
  state: MapState;
  team: MapTeam;
}

export type MappoolPickState = Record<string, MapPickState>;
