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
          const filteredForwards = boss.forwards !== undefined && boss.forwards.every(Boolean)
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
          {
            label: 'Имя',
            value: 'name',
            defaultValue: '???',
          },
          {
            label: 'Имя (без эмоджи)',
            value: 'plainName',
            defaultValue: '???',
          },

          {
            label: 'КМ',
            value: 'forwards.distance',
            defaultValue: '???',
          },
          {
            label: 'Текущее ХП',
            value: 'forwards.hpCurrent',
            defaultValue: '???',
          },
          {
            label: 'Урон',
            value: 'forwards.damage',
            defaultValue: '???',
          },

          {
            label: 'Максимальное ХП',
            value: 'forwards.hpMax',
            defaultValue: '???',
          },
          {
            label: 'Сила',
            value: 'forwards.strength',
            defaultValue: '???',
          },
          {
            label: 'Ловкость',
            value: 'forwards.agility',
            defaultValue: '???',
          },
          {
            label: 'Меткость',
            value: 'forwards.precision',
            defaultValue: '???',
          },
          {
            label: 'Харизма',
            value: 'forwards.charisma',
            defaultValue: '???',
          },
          {
            label: 'Броня',
            value: 'forwards.armor',
            defaultValue: '???',
          },
          {
            label: 'Выносливость',
            value: 'forwards.endurance',
            defaultValue: '???',
          },
          {
            label: 'Время форварда',
            value: 'forwards.time',
            defaultValue: '???',
          },
          {
            label: 'Время форварда (UNIX)',
            value: 'forwards.unixTime',
            defaultValue: '???',
          },
        ];

        const json2csvParser = new Json2csvParser({ fields, unwind: ['forwards'], unwindBlank: true });
        const csv = json2csvParser.parse(bossesToArray);

        cb(bossesToExport, csv);
      });
    }
  });
};
