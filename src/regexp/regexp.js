const bossSignUpRegExp = /.+Боссы\. Здесь происходит запись на охоту за сильнейшими созданиями Пустоши\.\n*Тобой недалеко от дороги был замечен \n(.+)/;

const nonEmojiTextRegExp = /(([аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]|[a-zA-Z])(\s?))+/;

const bossSignUp = {
  contains: [
    bossSignUpRegExp,
  ],
};

module.exports = {
  bossSignUp,
  bossSignUpRegExp,
  nonEmojiTextRegExp,
};
