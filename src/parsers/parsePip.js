const { regexps } = require('../regexp/pip');

const isInWasteland = text => text.indexOf('Пустошь') !== -1;

const parseClassic = (text) => {
  const [, charisma] = regexps.classicCharismaRegExp.exec(text);
  const [, agility] = regexps.classicAgilityRegExp.exec(text);
  const [, name] = regexps.classicNameRegExp.exec(text);
  const [, damage] = regexps.classicDamageRegExp.exec(text);
  const [, armor] = regexps.classicArmorRegExp.exec(text);
  const [, strength] = regexps.classicStrengthRegExp.exec(text);
  const [, precision] = regexps.classicPrecisionRegExp.exec(text);
  const [, endurance] = regexps.classicEnduranceRegExp.exec(text);
  const [, hunger] = regexps.classicHungerRegExp.exec(text);
  const [, healthActual, healthMax] = regexps.classicHealthRegExp.exec(text);
  const [, faction] = regexps.classicFactionRegExp.exec(text);
  const [, version] = regexps.classicVerisonRegExp.exec(text);
  const [fullDistanceOutput, distance] = regexps.classicDistanceRegExp.exec(text);

  const data = {
    version,
    faction,
    healthActual,
    healthMax,
    name,
    damage,
    armor,
    hunger,
    strength,
    precision,
    charisma,
    agility,
    endurance,
    distance,
    isInWasteland: isInWasteland(fullDistanceOutput),
  };

  Object.keys(data).forEach((key) => {
    if (!Number.isNaN(Number(data[key]))) {
      data[key] = Number(data[key]);
    }
  });

  return data;
};
const parseSimple = (text) => {
  const [, charisma] = regexps.simpleCharismaRegExp.exec(text);
  const [, agility] = regexps.simpleAgilityRegExp.exec(text);
  const [, strength] = regexps.simpleStrengthRegExp.exec(text);
  const [, endurance] = regexps.simpleEnduranceRegExp.exec(text);
  const [, precision] = regexps.simplePrecisionRegExp.exec(text);
  const [, hunger] = regexps.simpleHungerRegExp.exec(text);
  const [, healthActual, healthMax] = regexps.simpleHealthRegExp.exec(text);
  const [, armor] = regexps.simpleArmorRegExp.exec(text);
  const [, name] = regexps.simpleNameRegExp.exec(text);
  const [, faction] = regexps.simpleFactionRegExp.exec(text);
  const [, damage] = regexps.simpleDamageRegExp.exec(text);
  const [fullDistanceOutput, distance] = regexps.simpleDistanceRegExp.exec(text);

  const data = {
    name,
    armor,
    faction,
    healthActual,
    healthMax,
    hunger,
    strength,
    precision,
    charisma,
    agility,
    endurance,
    damage,
    version: 0,
    distance,
    isInWasteland: isInWasteland(fullDistanceOutput),
  };

  Object.keys(data).forEach((key) => {
    if (!Number.isNaN(Number(data[key]))) {
      data[key] = Number(data[key]);
    }
  });

  return data;
};

const parsePip = (text, isClassic) => {
  if (isClassic) {
    return parseClassic(text);
  }

  return parseSimple(text);
};

module.exports = parsePip;
