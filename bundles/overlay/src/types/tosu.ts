// Tosu v2 WebSocket payload types.
// Based on the /websocket/v2 endpoint — only fields used by this overlay
// are fully typed; everything else is marked as unknown for forward compatibility.

export interface TosuData {
  state: { number: number; name: string };
  beatmap: Beatmap;
  /** Top-level single-player / spectated gameplay — v2 field name is `play` */
  play: Gameplay;
  tourney: Tourney;
  folders: Folders;
  files: Files;
}

// ---------------------------------------------------------------------------
// Beatmap
// ---------------------------------------------------------------------------

export interface Beatmap {
  id: number;
  checksum: string;
  artist: string;
  artistUnicode: string;
  title: string;
  titleUnicode: string;
  version: string;
  mapper: string;
  stats: BeatmapStats;
  time: BeatmapTime;
}

export interface BeatmapStats {
  cs: Stat;
  ar: Stat;
  od: Stat;
  hp: Stat;
  bpm: BpmStat;
  stars: StarsStat;
}

export interface Stat {
  original: number;
  /** Value after applying active mods */
  converted: number;
}

export interface BpmStat {
  realtime: number;
  common: number;
  min: number;
  max: number;
}

export interface StarsStat {
  /** Live star rating (updates while playing) */
  live: number;
  total: number;
  aim: number;
  speed: number;
  flashlight: number;
  sliderFactor: number;
  hitWindow: number;
}

export interface BeatmapTime {
  /** Time in ms of the first hit object */
  firstObject: number;
  /** Time in ms of the last hit object */
  lastObject: number;
  /** Current playback position in ms */
  live: number;
  mp3Length: number;
}

// ---------------------------------------------------------------------------
// Gameplay (single player / spectated client)
// ---------------------------------------------------------------------------

export interface Gameplay {
  failed: boolean;
  score: number;
  accuracy: number;
  combo: Combo;
  healthBar: Hp;
  mods: Mods;
  hits: Hits;
  pp: Pp;
}

export interface Pp {
  current: number;
  fc: number;
  /** Best pp achieved so far this play */
  maxAchieved: number;
  /** Best pp achievable given current hit counts */
  maxAchievable: number;
}

export interface Combo {
  current: number;
  max: number;
}

export interface Hp {
  normal: number;
  smooth: number;
}

export interface Mods {
  checksum: string;
  /** Abbreviated mod string, e.g. "HDHR", "EZ", "NM" */
  name: string;
  number: number;
  array: Array<{ acronym: string }>;
  /** Speed rate, e.g. 1.5 for DT */
  rate: number;
}

export interface Hits {
  300: number;
  100: number;
  50: number;
  0: number;
  geki: number;
  katu: number;
  sliderBreaks: number;
  sliderEndHits: number;
  smallTickHits: number;
  largeTickHits: number;
}

// ---------------------------------------------------------------------------
// Tourney
// ---------------------------------------------------------------------------

export interface Tourney {
  scoreVisible: boolean;
  starsVisible: boolean;
  ipcState: number;
  /** Best-of count, e.g. 9 for BO9 */
  bestOF: number;
  team: TourneyTeams;
  points: TourneyPoints;
  totalScore: TourneyPoints;
  chat: ChatMessage[];
  /** One entry per client slot — left team first, then right team */
  clients: TourneyClient[];
}

export interface TourneyTeams {
  /** Left (red) team display name */
  left: string;
  /** Right (blue) team display name */
  right: string;
}

export interface TourneyPoints {
  left: number;
  right: number;
}

export interface ChatMessage {
  team: string;
  name: string;
  message: string;
  /** Display time string, e.g. "17:26" */
  timestamp: string;
}

export interface TourneyClient {
  ipcId: number;
  team: 'left' | 'right';
  settings: TourneyClientSettings;
  user: TourneyUser;
  /** Per-client beatmap stats (reflects individual mods applied) */
  beatmap: ClientBeatmap;
  play: Gameplay;
}

export interface TourneyClientSettings {
  mania: {
    scrollSpeed: number;
  };
}

/** Subset of beatmap data available per tourney client slot */
export interface ClientBeatmap {
  stats: BeatmapStats;
}

export interface TourneyUser {
  id: number;
  name: string;
  country: string;
  accuracy: number;
  rankedScore: number;
  playCount: number;
  globalRank: number;
  totalPP: number;
}

// ---------------------------------------------------------------------------
// File paths
// ---------------------------------------------------------------------------

export interface Folders {
  game: string;
  skin: string;
  songs: string;
  beatmap: string;
}

export interface Files {
  beatmap: string;
  background: string;
  audio: string;
}
