require('dotenv').config();

const Telegraf = require('telegraf').default;
const Stage = require('telegraf/stage');
const session = require('telegraf/session');
const Scene = require('telegraf/scenes/base');

const stage = new Stage();

const bot = new Telegraf(process.env.BOT_TOKEN, { username: 'coronavirus_test_bot' });

const getName = new Scene('getName');
stage.register(getName);
const getBirth = new Scene('getBirth');
stage.register(getBirth);
const getCity = new Scene('getCity');
stage.register(getCity);
const getBloodGroup = new Scene('getBloodGroup');
stage.register(getBloodGroup);
const getBloodRF = new Scene('getBloodRF');
stage.register(getBloodRF);
const getEmail = new Scene('getEmail');
stage.register(getEmail);
const getNumber = new Scene('getNumber');
stage.register(getNumber);
const check = new Scene('check');
stage.register(check);

bot.use(session());
bot.use(stage.middleware());

bot.hears('️⬅️ На головну', ctx => {
  ctx.reply(`Введіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  ctx.scene.enter('getName');
});

bot.start(ctx => {
  ctx.reply(`Введіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  ctx.scene.enter('getName');
});

getName.command('start', async ctx => {
  ctx.reply(`Почнемо спочатку.\nВведіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.scene.leave('getCity');
  ctx.scene.enter('getName');
});

getName.on('text', async ctx => {
  if (ctx.message.text === '◀️ Назад') {
    return ctx.reply('Вы уже вернулись в самое начало. Введите, пожалуйста, свое имя');
  }

  ctx.session.name = ctx.message.text;
  ctx.reply(`Ваш рік народження:\n:\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name}`, {
    reply_markup: { keyboard: [['◀️ Назад']], resize_keyboard: true, one_time_keyboard: true },
  });
  await ctx.scene.leave('getName');
  ctx.scene.enter('getBirth');
});

getBirth.hears(/^[0-9]{4}$/, async ctx => {
  ctx.session.birth = ctx.message.text;
  ctx.reply(
    'З якого Ви міста/села?' +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth}`,
    {
      reply_markup: {
        keyboard: [['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('getBirth');
  ctx.scene.enter('getCity');
});

getBirth.hears('◀️ Назад', async ctx => {
  ctx.reply(`Введіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.scene.leave('getBirth');
  ctx.scene.enter('getName');
});

getBirth.on('text', async ctx => {
  ctx.reply(
    'Введіть тільки Рік народження в формате 1990' +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name}`,
    {
      reply_markup: {
        keyboard: [['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
});

getCity.hears('◀️ Назад', async ctx => {
  ctx.reply(`Введіть Рік народження \n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name}`, {
    reply_markup: {
      keyboard: [['◀️ Назад', '❌ Стерти все!']],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave('getCity');
  ctx.scene.enter('getBirth');
});

getCity.hears(['❌ Стерти все!', '/start'], async ctx => {
  ctx.reply(`Почнемо спочатку.\nВведіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.scene.leave('getCity');
  ctx.scene.enter('getName');
});

getCity.on('text', async ctx => {
  ctx.session.city = ctx.message.text;
  ctx.reply(
    'Яка у Вас група крові?' +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city}`,
    {
      reply_markup: {
        keyboard: [['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('getCity');
  ctx.scene.enter('getBloodGroup');
});

getBloodGroup.hears('◀️ Назад', async ctx => {
  ctx.reply(
    'Яка у Вас група крові?' +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth}`,
    {
      reply_markup: {
        keyboard: [['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('getBloodGroup');
  ctx.scene.enter('getCity');
});

getBloodGroup.hears(['❌ Стерти все!', '/start'], async ctx => {
  ctx.reply(`Почнемо спочатку.\nВведіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.scene.leave('getBloodGroup');
  ctx.scene.enter('getName');
});

getBloodGroup.on('text', async ctx => {
  ctx.session.bloodgroup = ctx.message.text;
  ctx.reply(
    'Резус-фактор:' +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city};` +
      `\nГрупа крові: ${ctx.session.bloodgroup}`,
    {
      reply_markup: {
        keyboard: [['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('getBloodGroup');
  ctx.scene.enter('getBloodRF');
});

getBloodRF.hears('◀️ Назад', async ctx => {
  ctx.reply(
    'Який у Вас резус-фактор?' +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city};`,
    {
      reply_markup: {
        keyboard: [['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('getBloodRF');
  ctx.scene.enter('getBloodGroup');
});

getBloodRF.hears(['❌ Стерти все!', '/start'], async ctx => {
  ctx.reply(`Почнемо спочатку.\nВведіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.scene.leave('getBloodRF');
  ctx.scene.enter('getName');
});

getBloodRF.on('text', async ctx => {
  ctx.session.bloodrf = ctx.message.text;
  ctx.reply(
    `Ваш eMail:\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city};` +
      `\nГрупа крові: ${ctx.session.bloodgroup};\nРезус-фактор: ${ctx.session.bloodrf}`,
    {
      reply_markup: {
        keyboard: [['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('getBloodRF');
  ctx.scene.enter('getEmail');
});

getEmail.hears('◀️ Назад', async ctx => {
  ctx.reply(
    'Резус фактор' +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city};` +
      `\nГрупа крові: ${ctx.session.bloodgroup}`,
    {
      reply_markup: {
        keyboard: [['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('getEmail');
  ctx.scene.enter('getBloodRF');
});

getEmail.hears(['❌ Стерти все!', '/start'], async ctx => {
  ctx.reply(`Почнемо спочатку.\nВведіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.scene.leave('getEmail');
  ctx.scene.enter('getName');
});

getEmail.on('text', async ctx => {
  ctx.session.email = ctx.message.text;
  ctx.reply(
    `Натисніть кнопку "Відправити контакт", щоби ми могли з вами зв'язатись` +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city};` +
      `\nГрупа крові: ${ctx.session.bloodgroup};\nРезус-фактор: ${ctx.session.bloodrf};\neMail: ${ctx.session.email}`,
    {
      reply_markup: {
        keyboard: [
          [{ text: '📱 Відправити контакт', request_contact: true }],
          ['◀️ Назад', '❌ Стерти все!'],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('getEmail');
  ctx.scene.enter('getNumber');
});

getNumber.hears('◀️ Назад', async ctx => {
  ctx.reply(
    `eMail:` +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city};` +
      `\nГрупа крові: ${ctx.session.bloodgroup};\nРезус-фактор: ${ctx.session.bloodrf}`,
    {
      reply_markup: {
        keyboard: [['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('getNumber');
  ctx.scene.enter('getEmail');
});

getNumber.hears(['❌ Стерти все!', '/start'], async ctx => {
  ctx.reply(`Почнемо спочатку.\nВведіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.scene.leave('getNumber');
  ctx.scene.enter('getEmail');
  ctx.session = null;
});

getNumber.on('contact', async ctx => {
  ctx.session.phone = ctx.message.contact.phone_number;
  ctx.reply(
    '❗️ Перевірте Ваші дані та натисніть "Все вірно!", якщо вони коректні: ' +
      `\n\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city};` +
      `\nГрупа крові: ${ctx.session.bloodgroup};\nРезус-фактор: ${ctx.session.bloodrf};\neMail: ${ctx.session.email};` +
      `\nНомер: ${ctx.session.phone}`,
    {
      reply_markup: {
        keyboard: [['️✅ Все вірно!'], ['◀️ Назад', '❌ Стерти все!']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
      parse_mode: 'markdown',
    }
  );
  await ctx.scene.leave('getNumber');
  ctx.scene.enter('check');
});

check.hears('️✅ Все вірно!', ctx => {
  ctx.reply('✅ Дякуємо! Ви рятуєте життя!', {
    reply_markup: {
      keyboard: [['️⬅️ На головну']],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  ctx.scene.leave('main');

  bot.telegram.sendMessage(
    process.env.ADMIN,
    `Хоп-хэй-ла-ла-лэй!!! \n\nП.І.Б.: [${ctx.session.name}](tg://user?id=${ctx.from.id});\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city};` +
      `\nГрупа крові: ${ctx.session.bloodgroup};\nРезус-фактор: ${ctx.session.bloodrf};\neMail: ${ctx.session.email};` +
      `\nНомер: ${ctx.session.phone}`,
    { parse_mode: 'markdown' }
  );
  ctx.session = null;
});

check.hears('◀️ Назад', async ctx => {
  ctx.reply(
    'Нажмите кнопку "Отправить контакт" ниже, чтобы поделиться номером.' +
      `\n\nРаніше введені дані:\nП.І.Б.: ${ctx.session.name};\nРік народження: ${ctx.session.birth};\nМісто/село: ${ctx.session.city};` +
      `\nГрупа крові: ${ctx.session.bloodgroup};\nРезус-фактор: ${ctx.session.bloodrf};\neMail: ${ctx.session.email}`,
    {
      reply_markup: {
        keyboard: [
          [{ text: '📱 Відправити контакт', request_contact: true }],
          ['◀️ Назад', '❌ Стерти все!'],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave('check');
  ctx.scene.enter('getNumber');
});

check.hears(['❌ Стерти все!', '/start'], async ctx => {
  ctx.reply(`Почнемо спочатку.\nВведіть, будь-ласка, Ваші прізвище, ім'я та по-батькові`, {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.scene.leave('getNumber');
  ctx.scene.enter('getEmail');
  ctx.session = null;
});

bot.startPolling();
