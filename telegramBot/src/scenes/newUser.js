require('dotenv').config();
const { getAdmin, getSecretKey } = require('../config');
const { ageCheck } = require('../helpers/ageChecker');

const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const validator = require('validator');
const axios = require('axios');

const bot = require('../bot');
const { fullNameValidator } = require('../helpers/fullNameValidator');
// const { setUser } = require('../../../back/src/controller/userHandler');
// const { User } = require('../../../back/src/db/models/');


// const Telegraf = require('telegraf');

// new user registrator five-step wizard
const newUser = new WizardScene(
  'new_user',
  async ctx => {
    // experimental
    await ctx.reply('Давайте знайомитися! Як Вас звати?\n(<i>лише українською</i> 🇺🇦)\n\n Або натисни кнопку нижче 📱', {
      reply_markup: {
        keyboard: [[{ text: '📲 Використати дані з Telegram', request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    return ctx.wizard.next();
    // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    if (!ctx.message.contact) {
      if (ctx.message.text.length > 1 && fullNameValidator(ctx.message.text)) {
        ctx.wizard.state.name = ctx.message.text;
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx); 
      }
      ctx.reply(`🤦‍♂️ Нема такого ім'я.`);
      ctx.wizard.back(); 
      return ctx.wizard.steps[ctx.wizard.cursor](ctx); 
    } else {
      ctx.wizard.state.name = `${ctx.message.contact.first_name} ${ctx.message.contact.last_name}`;
      ctx.wizard.state.phone = ctx.message.contact.phone_number;
      console.log(`ID: ${ctx.message.from.id} USERNAME: ${ctx.message.from.username}`, ctx.message.contact);
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx); 
    }
    
  },
  ctx => {
    ctx.reply(`Звідки Ви? `);
    return ctx.wizard.next();
  },
  ctx => {

    if (ctx.message.text.length > 2 && fullNameValidator(ctx.message.text)) {
      ctx.wizard.state.locality = ctx.message.text;
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx); 
    }
    ctx.reply(`🤦‍♂️ Нема такого locality.`);
    ctx.wizard.back(); 
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.reply(`Введіть, будь-ласка, email:`);
    return ctx.wizard.next();
  },
  ctx => {
    console.log(ctx.message.text);
    if (validator.isEmail(ctx.message.text)) {
      ctx.wizard.state.email = ctx.message.text;
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx); 
    }
    ctx.reply(`🤦‍♂️ Такого email не існує!`);
    ctx.wizard.back(); 
    return ctx.wizard.steps[ctx.wizard.cursor](ctx); 
  },
  ctx => {
    ctx.reply(`🔞 Введіть, будь-ласка, дату Вашого народження:\n(у форматі: MM.DD.YYYY)`);
    return ctx.wizard.next();
  },
  ctx => {
    console.log(ctx.message.text);
    ctx.wizard.state.dob = validator.toDate(ctx.message.text);
    if (!ctx.wizard.state.dob) {
      ctx.reply(`Думаєш, це смішно?\nВ мене немає часу на ігри!`);
      ctx.wizard.back(); 
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
    if (ageCheck(ctx.wizard.state.dob) < 18) {
      ctx.reply('🔞 Сервіс лише для повнолітніх. Чекаємо Вас знову!');
      return ctx.scene.leave();
    }

    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    console.log(ctx.wizard.state.dob);
    ctx.reply(
      `Ну і найголовніше: \nяка у Вас група крові?`,
      Markup.keyboard([
        ['1', '2'],
        ['3', '4'],
      ])
        .resize()
        .removeKeyboard()
        .extra()
    );
    return ctx.wizard.next();
  },
  ctx => {
    if (
      ctx.message.text === '1' ||
      ctx.message.text === '2' ||
      ctx.message.text === '3' ||
      ctx.message.text === '4'
    ) {
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
    ctx.wizard.back();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.wizard.state.bloodType = ctx.message.text;
    console.log(ctx.wizard.state.bloodType);
    ctx.reply(
      `Ваш резус-фактор?`,
      Markup.keyboard([['+', '-']])
        .resize()
        .removeKeyboard()
        .extra()
    );
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message.text === '+' || ctx.message.text === '-') {
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
    ctx.wizard.back();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.wizard.state.rhesus = ctx.message.text;
    console.log(ctx.wizard.state.rhesus);

    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.reply(
      `Перевірте Ваші дані:
    Ім'я: ${ctx.wizard.state.name}
    Телефон: ${ctx.wizard.state.phone}
    Дата народження: ${ctx.wizard.state.dob}
    Ел.пошта: ${ctx.wizard.state.email}
    Група крові: ${ctx.wizard.state.bloodType}
    Резус-фактор: ${ctx.wizard.state.rhesus}`,
      Markup.keyboard([Markup.button('✅ Все вірно!'), Markup.button('❌ Спочатку')])
        .resize()
        .removeKeyboard()
        .extra(),
    );
    return ctx.wizard.next();
    // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    if (ctx.message.text !== '✅ Все вірно!') {
      ctx.wizard.selectStep(0);
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  async ctx => {
    const user = {
      fullName: ctx.wizard.state.name,
      dateOfBirth: ctx.wizard.state.dob,
      phoneNumber: ctx.wizard.state.phone,
      email: ctx.wizard.state.email,
      bloodType: ctx.wizard.state.bloodType,
      rhesus: ctx.wizard.state.rhesus,
      locality: ctx.wizard.state.locality,
      telegramId: ctx.from.id,
    };
    console.log('<< USER >>', user);
    const response = await axios({
      method: "POST",
      url: 'http://nodejs:3000/user',
      json: true,
      headers: {
        'Authorization': getSecretKey(),
      },
      data: user,
    });
    console.log('NEW USER RESPONSE FROM BACK:', response.data);
    // await setUser(user);
    
    await ctx.replyWithHTML(
      `🎉 Вітаємо, ${ctx.wizard.state.name}! 🎉 \nВи стали учасником проекту! 💉\nTисни /main для головного меню.`,
      Markup.removeKeyboard().extra()
    );

    bot.telegram.sendMessage(
      getAdmin(),
      `
    Ім'я: ${ctx.wizard.state.name}
    Телефон: ${ctx.wizard.state.phone}
    Дата народження: ${ctx.wizard.state.dob}
    Ел.пошта: ${ctx.wizard.state.email}
    Група крові: ${ctx.wizard.state.bloodType}
    Резус-фактор: ${ctx.wizard.state.rhesus}`
    );
    //
    // sharing ctx.wizard.state to DB with await
    //
    return ctx.scene.leave();
  }
);

module.exports = {
  newUser,
};
