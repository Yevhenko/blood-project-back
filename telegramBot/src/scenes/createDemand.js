require('dotenv').config();
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const request = require('request-promise-native');
const bot = require('../bot');
// const Telegraf = require('telegraf');

// new user registrator five-step wizard
const createDemand = new WizardScene(
  'create_demand',
  
  async ctx => {
    const currentUser = await request({
      method: "GET",
      uri: `http://localhost:3000/user?telegramId=${ctx.from.id}`,
      json: true,
    });
    console.log('RESPONSE FROM BACK:', currentUser);
    if (!currentUser){
      return ctx.scene.leave();
    };
  },

  ctx => {
    ctx.reply(`Ви вирішили створити нову заявку на донорську кров, я Вам із цим допоможу.`);
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.reply(`Почнемо з найголовнішого: \nкров якої групи Ви потребуєте?`, Markup.keyboard([
      ['1', '2'],
      ['3', '4']
      
      // [Markup.button('1'), Markup.button('2')],
      // [Markup.button('3'), Markup.button('4'),]
    ]).oneTime().resize().extra());
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message.text == '1' || ctx.message.text == '2' || ctx.message.text == '3' || ctx.message.text == '4') {
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    } else {
      ctx.wizard.back();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  },
  ctx => {
    ctx.wizard.state.bloodType = ctx.message.text;
    console.log(ctx.wizard.state.bloodType);
    ctx.reply(`А резус-фактор?`, Markup.keyboard([      
      [Markup.button('+'), Markup.button('-')]
    ]).resize().removeKeyboard().extra());
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message.text == '+' || ctx.message.text == '-') {
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    } else {
      ctx.wizard.back();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  },
  ctx => {  
    ctx.wizard.state.rhesus = ctx.message.text;
    console.log(ctx.wizard.state.rhesus);
    ctx.reply('Розкажіть, будь-ласка, для чого Вам потрібна донорська кров, а також додаткову інформацію:', Markup.removeKeyboard().extra());
    return ctx.wizard.next();
    // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.wizard.state.reason = ctx.message.text;

    ctx.replyWithMarkdown(
      `Перевірте Ваші дані:

    Група крові: ${ctx.wizard.state.bloodType}
    Резус-фактор: ${ctx.wizard.state.rhesus}
    Мета: ${ctx.wizard.state.reason}`,
      Markup.keyboard([      
        Markup.button('✅ Все вірно!'),
        Markup.button('❌ Спочатку'),
      ]).resize().removeKeyboard().extra(),
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
    await ctx.replyWithHTML(`💉`, Markup.removeKeyboard().extra());
    console.log(ctx.wizard.state);

    const demand = {
      fullName: currebtUser.fullName,
      phoneNumber: currebtUser.phoneNumber,
      bloodType: ctx.wizard.state.bloodType,
      rhesus: ctx.wizard.state.bloodType,
      reason: ctx.wizard.state.reason,
      userId: currentUser.userid,
    }

    const response = await request({
      method: "POST",
      uri: 'http://localhost:3000/demand',
      json: true,
      body: demand,
    });
    console.log('RESPONSE FROM BACK:', response);

    await ctx.replyWithHTML(`🎉 Вітаю! 🎉 \nЗаявку створено! 💉\nTисни /main для головного меню.`);
    // Sending message to admin
    bot.telegram.sendMessage(process.env.ADMIN, `
    Заявка від: ${ctx.from.first_name} ${ctx.from.last_name}
    Telegram ID: ${ctx.from.id}
    Група крові: ${ctx.wizard.state.bloodType}
    Резус-фактор: ${ctx.wizard.state.rhesus}
    Мета: ${ctx.wizard.state.reason}`,
    );
    // Scene exit
    return ctx.scene.leave();
  }
);

module.exports = {
  createDemand,
};
