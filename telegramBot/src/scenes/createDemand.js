require('dotenv').config();
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const bot = require('../bot');
const validator = require('validator');
// const Telegraf = require('telegraf');


// new user registrator five-step wizard
const createDemand = new WizardScene(
  'create_demand',
  ctx => {
    ctx.reply(`Ви вирішили створити нову заявку на донорську кров, я Вам із цим допоможу.`);
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.reply(`Почнемо з найголовнішого: \nкров якої групи Ви потребуєте?`, Markup.keyboard([
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
    ctx.reply(`А резус-фактор?`, Markup.keyboard([      
      Markup.button('+'),
      Markup.button('-'),
    ]).resize().extra());
    return ctx.wizard.next();
  },
  ctx => {  
    ctx.wizard.state.rhesus = ctx.message.text;
    console.log(ctx.wizard.state.rhesus);
    ctx.reply('Розкажіть, будь-ласка, для чого Вам потрібна донорська кров, а також додаткову інформацію:');
    return ctx.wizard.next();
    // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.wizard.state.aim = ctx.message.text;

    ctx.reply(
      `Перевірте Ваші дані:

    Група крові: ${ctx.wizard.state.bloodType}
    Резус-фактор: ${ctx.wizard.state.rhesus}
    Мета: ${ctx.wizard.state.aim}`,
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
    await ctx.replyWithHTML(`💉`);
    console.log(ctx.wizard.state);
    await ctx.replyWithHTML(`🎉 Вітаємо, ${ctx.wizard.state.name}! 🎉 \nВи стали учасником проекту! 💉`, Markup.removeKeyboard().extra())
    bot.telegram.sendMessage(process.env.ADMIN, `

    Група крові: ${ctx.wizard.state.bloodType}
    Резус-фактор: ${ctx.wizard.state.rhesus}
    Мета: ${ctx.wizard.state.aim}`,
    );
    // 
    // sharing ctx.wizard.state to DB with await
    // 
    return ctx.scene.leave();
  }
);

module.exports = {
  createDemand,
};
