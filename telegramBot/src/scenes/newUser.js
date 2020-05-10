require('dotenv').config();
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const bot = require('../bot');
const validator = require('validator');
// const Telegraf = require('telegraf');


// new user registrator five-step wizard
const newUser = new WizardScene(
  'new_user',
  ctx => {
    ctx.reply(`Давайте знайомитися! Як Вас звати?`);
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message.text.length < 4) {      
      ctx.reply(`🤦‍♂️ Нема такого ім'я.`);
      ctx.wizard.back();  // Set the listener to the previous function
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);  // Manually trigger the listener with the current ctx

    } else {
      ctx.wizard.state.name = ctx.message.text;
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);  // Manually trigger the listener with the current ctx

    }
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
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);  // Manually trigger the listener with the current ctx
    } else {
      ctx.reply(`🤦‍♂️ Такого email не існує! \nНе раджу гратися зі мною, друже!`);
      ctx.wizard.back();  // Set the listener to the previous function
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);  // Manually trigger the listener with the current ctx
    }
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
      ctx.wizard.back();  // Set the listener to the previous function
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    };
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    console.log(ctx.wizard.state.dob);
    ctx.reply(`Ну і найголовніше: \nяка у Вас рупа крові?`, Markup.keyboard([
      Markup.button('1'),
      Markup.button('2'),
      Markup.button('3'),
      Markup.button('4'),
    ]).resize().extra());
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.bloodType = ctx.message.text;
    console.log(ctx.wizard.state.bloodType);
    ctx.reply(`Втомився!? Ніхто не обіцяв, що буде легко.\nОстаннє питання: Ваш резус-фактор?`, Markup.keyboard([      
      Markup.button('+'),
      Markup.button('-'),
    ]).resize().extra());
    return ctx.wizard.next();
  },
  ctx => {  
    ctx.wizard.state.rhesus = ctx.message.text;
    console.log(ctx.wizard.state.rhesus);
    ctx.reply('Натисни кнопку нижче, щоб я дізнався номер твого мобільного 📱', { 
      reply_markup: { 
        keyboard: [[{text: '📲 Поділитися контактом', request_contact: true}]],
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
    // return ctx.wizard.steps[ctx.wizard.cursor](ctx);

  },
  ctx => {
    if (ctx.message.text == '❌ Спочатку') {
      ctx.wizard.selectStep(0);
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }; 
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  async ctx => {
    await ctx.replyWithDice();
    console.log(ctx.wizard.state);
    await ctx.replyWithHTML(`🎉 Вітаємо, ${ctx.wizard.state.name}! 🎉 \nВи стали учасником проекту! 💉`)
    bot.telegram.sendMessage(process.env.ADMIN, `
    Ім'я: ${ctx.wizard.state.name}
    Телефон: ${ctx.wizard.state.phone}
    Дата народження: ${ctx.wizard.state.dob}
    Ел.пошта: ${ctx.wizard.state.email}
    Група крові: ${ctx.wizard.state.bloodType}
    Резус-фактор: ${ctx.wizard.state.rhesus}`,
    );
    // 
    // sharing ctx.wizard.state to DB with await
    // 
    return ctx.scene.leave();
  },
  
);

module.exports = {
  newUser,
};
