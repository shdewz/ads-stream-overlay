'use strict';

const path = require('path');
const fs = require('fs');

/** @param {import('nodecg/types').NodeCG} nodecg */
module.exports = function (nodecg) {
  const beatmapsPath = path.join(__dirname, '..', '..', '..', 'data', 'beatmaps.json');
  const comingUpPath = path.join(__dirname, '..', '..', '..', 'data', 'coming_up.json');

  const load = (filePath) => {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      nodecg.log.error('[overlay] Failed to read ' + path.basename(filePath) + ':', err);
      return null;
    }
  };

  const beatmapsRep = nodecg.Replicant('beatmaps', {
    defaultValue: load(beatmapsPath),
    persistent: false,
  });

  fs.watch(beatmapsPath, () => {
    const fresh = load(beatmapsPath);
    if (fresh) beatmapsRep.value = fresh;
  });

  const comingUpRep = nodecg.Replicant('comingUp', {
    defaultValue: load(comingUpPath),
    persistent: false,
  });

  fs.watch(comingUpPath, () => {
    const fresh = load(comingUpPath);
    if (fresh) comingUpRep.value = fresh;
  });

  nodecg.Replicant('mappoolState', {
    defaultValue: {},
    persistent: true,
  });
};
