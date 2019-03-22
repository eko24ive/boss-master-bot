require('dotenv').config();
const async = require('async');
const moment = require('moment');
const Json2csvParser = require('json2csv').Parser;

const { nonEmojiTextRegExp } = require('../regexp/regexp');

module.exports = function getDump(Boss, cb) {
  Boss.find().then((bosses) => {
    const bossesToExport = {};

    if (bosses !== null) {
      async.forEach(bosses, (_boss, next) => {
        const boss = _boss.toJSON();

        if (bossesToExport[boss.name] === undefined) {
          const filteredForwards = boss.forwards !== undefined
            ? boss.forwards.map(({
              user,
              stamp,
              time,
              _id,
              ...rest
            }) => ({
              ...rest,
              time: moment(time * 1000).format('DD.MM.YYYY HH:mm'),
              unixTime: time * 1000,
            })) : [];

          bossesToExport[boss.name] = {
            name: boss.name,
            plainName: nonEmojiTextRegExp.exec(boss.name).shift(),
            forwards: filteredForwards,
          };

          next();
        } else {
          next();
        }
      }, () => {
        const bossesToArray = Object.keys(bossesToExport).map(name => bossesToExport[name]);
        const fields = [
          'name',
          'plainName',
          'forwards.hpCurrent',
          'forwards.hpMax',
          'forwards.damage',
          'forwards.armor',
          'forwards.strength',
          'forwards.precision',
          'forwards.charisma',
          'forwards.agility',
          'forwards.endurance',
          'forwards.time',
          'forwards.unixTime',
          'forwards.distance',
        ];

        const json2csvParser = new Json2csvParser({ fields, unwind: ['forwards'], unwindBlank: true });
        const csv = json2csvParser.parse(bossesToArray);

        cb(bossesToExport, csv);
      });
    }
  });
};
