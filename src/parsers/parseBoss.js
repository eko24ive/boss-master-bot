const {
  bossSignUpRegExp,
} = require('../regexp/regexp');

const parseBoss = (text) => {
  if (bossSignUpRegExp.test(text)) {
    const [, name] = bossSignUpRegExp.exec(text);

    return {
      name,
    };
  }
  return null;
};

module.exports = parseBoss;
