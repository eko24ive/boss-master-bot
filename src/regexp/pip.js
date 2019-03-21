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
const classicHealthRegExp = /❤️Здоровье: \d*\/(\d*)/;
const classicVerisonRegExp = /📟Пип-бой 3000 v(.+)/;

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
const simpleHealthRegExp = /❤️\d*\/(\d+)/;

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
};

module.exports = {
  classicPip,
  simplePip,
  regexps,
};
