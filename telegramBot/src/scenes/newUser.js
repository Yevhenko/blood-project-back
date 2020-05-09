const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const bot = require('../bot');
const validator = require('validator');

// new user registrator five-step wizard
const newUser = new WizardScene(
  'new_user',
  ctx => {
    ctx.reply(`Почнемо! Як Вас звати?`);
    return ctx.wizard.next();
  },
  ctx => {
    //here will be some validation soon
    ctx.wizard.state.name = ctx.message.text;
    console.log(ctx.wizard.state);    // enter your name
    return ctx.wizard.next();
  },
  ctx => {
    ctx.reply(`Please enter your email:`);
    return ctx.wizard.next();

  },
  ctx => {
    console.log(ctx.message.text);
    if (validator.isEmail(ctx.message.text)) {
      ctx.wizard.state.email = ctx.message.text;  
    } else {
      ctx.reply(`Not valid email. `);
      ctx.wizard.back();  // Set the listener to the previous function
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);  // Manually trigger the listener with the current ctx
    }
    return ctx.wizard.next();
  },
  ctx => {
    ctx.reply(`Please enter your date of birth:`);
    return ctx.wizard.next();
  },
  ctx => {
    console.log(ctx.message.text);
    ctx.wizard.state.dob = validator.toDate(ctx.message.text);
    if (!ctx.wizard.state.dob) {
      ctx.reply(`Наебать меня решил?`);
      ctx.wizard.back();  // Set the listener to the previous function
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    };
    return ctx.wizard.next();
  },
  ctx => {
    console.log(ctx.wizard.state.dob);
    ctx.reply(`Please choose your blood type:`, Markup.keyboard([
      Markup.button('1'),
      Markup.button('2'),
      Markup.button('3'),
      Markup.button('4'),
      // Markup.callbackButton('1', 1),
      // Markup.callbackButton('2', 2),
      // Markup.callbackButton('3', 3),
      // Markup.callbackButton('4', 4),
      Markup.urlButton('I do not know :(', 'http://google.com'),
    ]).resize().extra());
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.bloodType = ctx.message.text;
    console.log(ctx.wizard.state.bloodType);
    ctx.reply(`Please choose your rhesus:`, Markup.keyboard([      
      Markup.button('+'),
      Markup.button('-'),
      Markup.urlButton(`I don't know`, `http://google.com`),
    ]).resize().extra());
    return ctx.wizard.next();
  },
  ctx => {  
    ctx.wizard.state.rhesus = ctx.message.text;
    console.log(ctx.wizard.state.rhesus);
    ctx.reply('Share please your contact pressing a button below', { 
      reply_markup: { 
        keyboard: [[{text: '📲 Share contact', request_contact: true}]],
        resize_keyboard: true,
        one_time_keyboard: true, 
      },
    });
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.phone = ctx.message.contact.phone_number;

    ctx.reply(
      `Перевірте Ваші дані:
      Ім'я: ${ctx.wizard.state.name}
      Телефон: ${ctx.wizard.state.phone}
      Дата народження: ${ctx.wizard.state.dob}
      Ел.пошта: ${ctx.wizard.state.email}
      Група крові: ${ctx.wizard.state.bloodType}
      Резус-фактор: ${ctx.wizard.state.rhesus}`,
      Markup.keyboard([      
        Markup.button('✅ Все вірно!'),
        Markup.button('❌ Спочатку'),
      ]).resize().extra(),
      { parse_mode: 'markdown' }
      );
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message.text == '❌ Спочатку') {
      ctx.wizard.selectStep(0);
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }; 
    return ctx.wizard.next();
  },
  async ctx => {
    await ctx.replyWithDice();
    console.log(ctx.wizard.state);
    await ctx.reply(`Вітаємо, ${ctx.wizard.state.name}! Ви стали учасником проекту!`)
    bot.telegram.sendMessage(process.env.ADMIN, ctx.wizard.state, { parse_mode: 'markdown' });
    // 
    // sharing ctx.wizard.state to DB with await
    // 
    return ctx.scene.leave();
  },
);

module.exports = {
  newUser,
};
