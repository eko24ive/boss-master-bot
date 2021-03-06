require('dotenv').config();
const TeleBot = require('telebot');
const mongoose = require('mongoose');
const async = require('async');
const moment = require('moment');
const encoding = require('encoding');

const regexps = require('./regexp/regexp');
const pipRegexps = require('./regexp/pip');
const parseBoss = require('./parsers/parseBoss');
const parsePip = require('./parsers/parsePip');
const {
  regExpSetMatcher,
} = require('./utils/matcher');
const validateForwardDate = require('./utils/validateForwardDate');
const getDump = require('./utils/getDump');
const processForwards = require('./utils/processForwards');

const bossSchema = require('./schemes/boss');

const Boss = mongoose.model('Boss', bossSchema);

mongoose.connect(process.env.MONGODB_URI);
const bot = new TeleBot(process.env.BOT_TOKEN);
let dumpJsonFile;
let dumpCsvFile;
let dumpCsvFileRU;

const dumpStatuses = {
  NOT_READY: 0,
  READY: 1,
};

const botState = { dumpStatus: dumpStatuses.NOT_READY };

setTimeout(() => {
  botState.dumpStatus = dumpStatuses.NOT_READY;

  getDump(Boss, (jsonDumpFile, _dumpCsvFile) => {
    dumpJsonFile = Buffer.from(JSON.stringify(jsonDumpFile));
    dumpCsvFile = Buffer.from(_dumpCsvFile);
    dumpCsvFileRU = encoding.convert(_dumpCsvFile, 'CP1251', 'UTF-8');
    botState.dumpStatus = dumpStatuses.READY;
  });
}, 10000);

getDump(Boss, (jsonDumpFile, _dumpCsvFile) => {
  dumpJsonFile = Buffer.from(JSON.stringify(jsonDumpFile));
  dumpCsvFile = Buffer.from(_dumpCsvFile);
  dumpCsvFileRU = encoding.convert(_dumpCsvFile, 'CP1251', 'UTF-8');
  botState.dumpStatus = dumpStatuses.READY;
});


const sessions = {};

const createSession = (id) => {
  sessions[id] = {
    state: 'WAIT_FOR_FORWARD',
    data: [],
  };
};

const defaultKeyboard = bot.keyboard([
  ['📨 Отправить пачку', '💾 Скачать дамп'],
], {
  resize: true,
});

const getState = (id) => {
  if (sessions[id] !== undefined) {
    return sessions[id].state;
  }

  return null;
};

const setState = (id, state) => {
  if (getState(id) === null) {
    createSession(id);
  }

  sessions[id].state = state;
};

const getSessionData = (id) => {
  if (sessions[id]) {
    return sessions[id].data || null;
  }

  return null;
};

const pushSessionData = (id, data) => {
  sessions[id].data.push(data);
};

const updateBosses = (msg, sessionData) => {
  let dupes = 0;
  let errorsText = '';

  if (sessionData.length === 0) {
    return msg.reply.text('Ты ебобо или да?! Ты мне ничего не скинул');
  }

  const processedForwards = processForwards(sessionData, msg);

  if (processedForwards.every(f => f.ignore)) {
    return msg.reply.text('Форварды что ты мне скинул оказались сомнительными, наверное из за того что разница между пипом и форвадом записи больше 30 секунд, мне нечего записывать в базу.', {
      replyMarkup: defaultKeyboard,
    });
  }

  if (processedForwards.some(f => f.ignore)) {
    errorsText = '\n\n<b>Похоже что я не смог обработать некоторые твои форварды, наверное из за того что разница между пипом и форвадом записи больше 30 секунд</b>';
  }

  async.forEach(processedForwards, (iBoss, next) => {
    Boss.findOne({ name: iBoss.name }).then((boss) => {
      if (boss !== null) {
        const isForwardDupe = boss.toJSON().forwards.some(({ stamp }) => stamp === iBoss.stamp);

        if (!isForwardDupe) {
          boss.forwards.push(iBoss.forwards);

          boss.markModified('forwards');
        } else {
          dupes += 1;
        }

        boss.save(() => {
          next();
        });
      } else {
        const newBoss = new Boss(iBoss);

        newBoss.save(() => {
          next();
        });
      }
    });
  }, () => {
    const allDupes = dupes === processedForwards.length;
    const someDupes = dupes > 0;
    const someDupesReply = someDupes ? '\nБыли замечены дубликаты.' : '';
    if (allDupes) {
      msg.reply.text('Я не увидел новых форвардов', {
        replyMarkup: defaultKeyboard,
      });
    } else {
      msg.reply.text(`Я успешно обработал информацию и сохранил ёё в базу${someDupesReply}${errorsText}`, {
        replyMarkup: defaultKeyboard,
      });
    }

    createSession(msg.from.id);
  });

  return null;
};

bot.on(['/start', '/help'], (msg) => {
  createSession(msg.from.id);

  return msg.reply.text(`Привет, я БАБа - «<b>Бешенный Анализатор Боссов</b>».
Меня создали много тысячь лет назад. И всё для того что бы разгадать секрет газеток.

Отправляй мне форвард записи на битву с боссом вместе со своим пипом и я их его обработаю.

Связь с моим мастером (ему стоит сообщать о найденных багах) - @eko24
Чат по исследованию пустоши - @RI_Agroprom

Перед началом работы со мной рекомендую заглянуть в /faq.`, {
    parseMode: 'html',
    webPreview: false,
    replyMarkup: defaultKeyboard,
  });
});

bot.on('/faq', msg => msg.reply.text(`
1. Форварды принимаються только через режим "Отправить Пачку".

2. Бот выдаёт собранные данные в виде дампа. Дамп обновляется каждые 10 минут. Инструмент для просмотра дампа ещё находиться в разработке.

3. Форвард записи на битву выглядит следующим образом:<code>
⚜️Боссы. Здесь происходит запись на охоту за сильнейшими созданиями Пустоши.

Тобой недалеко от дороги был замечен
{Имя босса}

За его голову назначена большая награда. Если ты готов сразиться с ним, то записывайся в отряд: нужно хотя бы 4 человека, чтобы отправиться на охоту за этим чудищем. Просто отметь у себя в записях это чудище, чтобы преследовать."
</code>`, {
  parseMode: 'html',
}));

bot.on('text', (msg) => {
  switch (msg.text) {
    case '📨 Отправить пачку':
      setState(msg.from.id, 'WAIT_FOR_FORWARDS');

      return msg.reply.text(`Окей, жду твои форварды. Как закончишь - жми Стоп.
      Можешь скидывать любое количество форвардов с разных кругов!
      <b>Разница между пипом и записью на босса не должна превышать 50 секунд</b>`, {
        parseMode: 'html',
        replyMarkup: bot.keyboard([
          ['Стоп'],
        ], {
          resize: true,
          once: true,
          remove: true,
        }),
      });
    case 'Стоп': {
      const sessionData = getSessionData(msg.from.id);

      if (sessionData !== null) {
        return updateBosses(msg, sessionData);
      }

      return msg.reply.text('Сорян, похоже меня перезагрузил какой-то пидор', {
        replyMarkup: defaultKeyboard,
      });
    }

    case '💾 Скачать дамп': {
      if (botState.dumpStatus === dumpStatuses.READY) {
        msg.reply.file(dumpCsvFile, {
          fileName: `bosses-${moment().format('DD-MM-YYYY')}-UTF8.csv`,
          // caption: 'Используй этот дамп на сайте https://eko24ive.github.io/bosses-browser/',
        });
        msg.reply.file(dumpCsvFileRU, {
          fileName: `bosses-${moment().format('DD-MM-YYYY')}-CP1251.csv`,
          // caption: 'Используй этот дамп на сайте https://eko24ive.github.io/bosses-browser/',
        });
        return msg.reply.file(dumpJsonFile, {
          fileName: `bosses-${moment().format('DD-MM-YYYY')}.json`,
          // caption: 'Используй этот дамп на сайте https://eko24ive.github.io/bosses-browser/',
        });
      }

      return msg.reply.text('Дамп ещё не готов');
    }

    default:
      return null;
  }
});

bot.on('forward', (msg) => {
  if (msg.forward_from.id !== 430930191) {
    return msg.reply.text(`
Ты заёбал. Форварды принимаються только от @WastelandWarsBot.
            `, {
      asReply: true,
    });
  }

  if (!validateForwardDate(msg.forward_date)) {
    return msg.reply.text('❌<b>ЗАМЕЧЕНА КРИТИЧЕСКАЯ ОШИБКА</b>❌\n\nБыл замечен форвард, время которого меньше, чем время последнего обновления Wasteland Wars (19.09.2018)', {
      asReply: true,
      parseMode: 'html',
    });
  }

  const state = getState(msg.from.id);

  if (state === 'WAIT_FOR_FORWARDS') {
    if (regExpSetMatcher(msg.text, {
      regexpSet: regexps.bossSignUp,
    })) {
      const { name } = parseBoss(msg.text);

      const parsedBossSignUp = {
        name,
        type: 'signUpMessage',
        date: msg.forward_date,
      };

      return pushSessionData(msg.from.id, parsedBossSignUp);
    } if (regExpSetMatcher(msg.text, {
      regexpSet: pipRegexps.classicPip,
    })) {
      const pip = {
        ...parsePip(msg.text, true),
        type: 'pipboy',
        date: msg.forward_date,
      };

      return pushSessionData(msg.from.id, pip);
    } if (regExpSetMatcher(msg.text, {
      regexpSet: pipRegexps.simplePip,
    })) {
      const pip = {
        ...parsePip(msg.text, false),
        type: 'pipboy',
        date: msg.forward_date,
      };

      return pushSessionData(msg.from.id, pip);
    }

    return msg.reply.text('Прости, но этот форвард меня не интересует :с', {
      asReply: true,
    });
  }

  return msg.reply.text('Я принимаю форварды только в режиме "📨 Отправить пачку" !!!');
});


bot.start();
