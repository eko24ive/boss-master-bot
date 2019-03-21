const {
  bossSignUpRegExp,
} = require('../regexp/regexp');

const parseBoss = (text) => {
  if (bossSignUpRegExp.test(text)) {
    const [, bossName] = bossSignUpRegExp.exec(text);

    return {
      bossName,
    };
  }
  return null;
};

module.exports = parseBoss;
