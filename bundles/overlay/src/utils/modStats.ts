interface BpmRange {
  min: number;
  max: number;
  common: number;
}

export interface ModdedStats {
  cs: number;
  ar: number;
  od: number;
  bpm: number;
  speed: number;
}

const normalizeMods = (mods: string | undefined): string =>
  (mods ?? '').toUpperCase().replace('NC', 'DT');

const getSpeedMultiplier = (mods: string): number =>
  mods.includes('DT') ? 1.5 : mods.includes('HT') ? 0.75 : 1;

export const getModStats = (
  csRaw: number,
  arRaw: number,
  odRaw: number,
  bpmRaw: number,
  modsInput: string | undefined
): ModdedStats => {
  const mods = normalizeMods(modsInput);
  const speed = getSpeedMultiplier(mods);

  let ar = mods.includes('HR') ? arRaw * 1.4 : mods.includes('EZ') ? arRaw * 0.5 : arRaw;
  const arMs =
    Math.max(Math.min(ar <= 5 ? 1800 - 120 * ar : 1200 - 150 * (ar - 5), 1800), 450) / speed;
  ar = ar < 5 ? (1800 - arMs) / 120 : 5 + (1200 - arMs) / 150;

  const cs = mods.includes('HR') ? csRaw * 1.3 : mods.includes('EZ') ? csRaw * 0.5 : csRaw;

  let od = Math.min(
    mods.includes('HR') ? odRaw * 1.4 : mods.includes('EZ') ? odRaw * 0.5 : odRaw,
    10
  );
  if (speed !== 1) {
    od = (79.5 - Math.min(79.5, Math.max(19.5, 79.5 - Math.ceil(6 * od))) / speed) / 6;
  }

  return {
    cs: Math.round(cs * 10) / 10,
    ar: Math.round(ar * 10) / 10,
    od: Math.round(od * 10) / 10,
    bpm: Math.round(bpmRaw * speed * 10) / 10,
    speed,
  };
};

export const scaleBpmByMods = (bpm: BpmRange, modsInput: string | undefined): BpmRange => {
  const speed = getSpeedMultiplier(normalizeMods(modsInput));
  return {
    min: Math.round(bpm.min * speed * 10) / 10,
    max: Math.round(bpm.max * speed * 10) / 10,
    common: Math.round(bpm.common * speed * 10) / 10,
  };
};
