export const TourneyState = {
  Initialising: 0,
  Idle: 1,
  WaitingForClients: 2,
  Playing: 3,
  Ranking: 4,
} as const;

export interface TosuData {
  state: { number: number; name: string };
  beatmap: Beatmap;
  play: Gameplay;
  tourney: Tourney;
  folders: Folders;
  files: Files;
}

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
  converted: number;
}

export interface BpmStat {
  realtime: number;
  common: number;
  min: number;
  max: number;
}

export interface StarsStat {
  live: number;
  total: number;
  aim: number;
  speed: number;
  flashlight: number;
  sliderFactor: number;
  hitWindow: number;
}

export interface BeatmapTime {
  firstObject: number;
  lastObject: number;
  live: number;
  mp3Length: number;
}

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
  maxAchieved: number;
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
  name: string;
  number: number;
  array: Array<{ acronym: string }>;
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

export interface Tourney {
  scoreVisible: boolean;
  starsVisible: boolean;
  ipcState: number;
  bestOF: number;
  team: TourneyTeams;
  points: TourneyPoints;
  totalScore: TourneyPoints;
  chat: ChatMessage[];
  clients: TourneyClient[];
}

export interface TourneyTeams {
  left: string;
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
  timestamp: string;
}

export interface TourneyClient {
  ipcId: number;
  team: 'left' | 'right';
  settings: TourneyClientSettings;
  user: TourneyUser;
  beatmap: ClientBeatmap;
  play: Gameplay;
}

export interface TourneyClientSettings {
  mania: {
    scrollSpeed: number;
  };
}

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
