const classicNameRegExp = /(.*),.*\n/;
const classicFactionRegExp = /.*,(.*)\n/;
const classicCharismaRegExp = /🗣Харизма: (\d*)/;
const classicAgilityRegExp = /🤸🏽‍♂️Ловкость: (\d*)/;
const classicDamageRegExp = /⚔️Урон: (\d*)/;
const classicArmorRegExp = /🛡Броня: (\d*)/;
const classicStrengthRegExp = /💪Сила: (\d*)/;
const classicPrecisionRegExp = /🎯Меткость: (\d*)/;
const classicEnduranceRegExp = /🔋Выносливость: \d*\/(\d*)/;
const classicHungerRegExp = /☠️Голод: ([\d]*)%/;
const classicHealthRegExp = /❤️Здоровье: (\d*)\/(\d*)/;
const classicVerisonRegExp = /📟Пип-бой 3000 v(.+)/;
const classicDistanceRegExp = /📍.+,\D+(\d*).+/;

const simpleNameRegExp = /👤(.*)/;
const simpleFactionRegExp = /👤.*\n├.*\n├(.*)/;
const simpleCharismaRegExp = /🗣(\d+)/;
const simpleAgilityRegExp = /🤸🏽‍♂️(\d+)/;
const simpleDamageRegExp = /⚔️(\d+)/;
const simpleArmorRegExp = /🛡(\d+)/;
const simpleStrengthRegExp = /💪(\d+)/;
const simplePrecisionRegExp = /🔫(\d+)/;
const simpleEnduranceRegExp = /🔋\d*\/(\d+)/;
const simpleHungerRegExp = /🍗(\d+)%/;
const simpleHealthRegExp = /❤️(\d*)\/(\d+)/;
const simpleDistanceRegExp = /\| 👣(\d*)\n├.+/;

const classicPip = {
  contains: [
    classicNameRegExp,
    classicFactionRegExp,
    classicCharismaRegExp,
    classicAgilityRegExp,
    classicDamageRegExp,
    classicArmorRegExp,
    classicStrengthRegExp,
    classicPrecisionRegExp,
    classicEnduranceRegExp,
    classicHungerRegExp,
    classicHealthRegExp,
    classicVerisonRegExp,
    classicDistanceRegExp,
  ],
  excludes: [
    simpleNameRegExp,
    simpleFactionRegExp,
    simpleCharismaRegExp,
    simpleAgilityRegExp,
    simpleDamageRegExp,
    simpleArmorRegExp,
    simpleStrengthRegExp,
    simplePrecisionRegExp,
    simpleEnduranceRegExp,
    simpleHungerRegExp,
    simpleHealthRegExp,
  ],
};

const simplePip = {
  contains: [
    simpleNameRegExp,
    simpleFactionRegExp,
    simpleCharismaRegExp,
    simpleAgilityRegExp,
    simpleDamageRegExp,
    simpleArmorRegExp,
    simpleStrengthRegExp,
    simplePrecisionRegExp,
    simpleEnduranceRegExp,
    simpleHungerRegExp,
    simpleHealthRegExp,
    simpleDistanceRegExp,
  ],
  excludes: [
    classicNameRegExp,
    classicFactionRegExp,
    classicCharismaRegExp,
    classicAgilityRegExp,
    classicDamageRegExp,
    classicArmorRegExp,
    classicStrengthRegExp,
    classicPrecisionRegExp,
    classicEnduranceRegExp,
    classicHungerRegExp,
    classicHealthRegExp,
    classicVerisonRegExp,
  ],
};

const regexps = {
  classicNameRegExp,
  classicFactionRegExp,
  classicCharismaRegExp,
  classicAgilityRegExp,
  classicDamageRegExp,
  classicArmorRegExp,
  classicStrengthRegExp,
  classicPrecisionRegExp,
  classicEnduranceRegExp,
  classicHungerRegExp,
  classicHealthRegExp,
  classicVerisonRegExp,
  classicDistanceRegExp,
  simpleNameRegExp,
  simpleFactionRegExp,
  simpleCharismaRegExp,
  simpleAgilityRegExp,
  simpleDamageRegExp,
  simpleArmorRegExp,
  simpleStrengthRegExp,
  simplePrecisionRegExp,
  simpleEnduranceRegExp,
  simpleHungerRegExp,
  simpleHealthRegExp,
  simpleDistanceRegExp,
};

module.exports = {
  classicPip,
  simplePip,
  regexps,
};
