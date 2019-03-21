require('dotenv').config();
const async = require('async');
const moment = require('moment');

module.exports = function getDump(Dungeon, cb) {
  const dungeonsToExport = {};

  Dungeon.find().then((dungeons) => {
    if (dungeons !== null) {
      async.forEach(dungeons, (dungeon, next) => {
        if (dungeonsToExport[dungeon.name] === undefined) {
          const filteredForwards = dungeon.forwards !== undefined
            ? dungeon.forwards.map(forward => ({
              item: forward.item,
              caps: forward.caps,
              materials: forward.materials,
              loot: forward.loot,
              time: moment(forward.time * 1000).format('DD.MM.YYYY HH:mm'),
              unixTime: forward.time * 1000,
            })) : [];

          dungeonsToExport[dungeon.name] = {
            name: dungeon.name,
            technicalName: dungeon.name,
            forwards: filteredForwards,
          };

          next();
        } else {
          next();
        }
      }, () => {
        cb(dungeonsToExport);
      });
    }
  });
};
