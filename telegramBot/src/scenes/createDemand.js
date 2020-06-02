require('dotenv').config();
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const bot = require('../bot');
const axios = require('axios');
// const { mailingAgent } = require('../helpers/mailingAgent');
// const Telegraf = require('telegraf');

const { getAdmin, getSecretKey } = require('../config');

const { logger } = require('../logger');
const log = logger(__filename);

// new user registrator five-step wizard
const createDemand = new WizardScene(
  'create_demand',
  
  async ctx => {
    try {
      const { data: currentUser } = await axios({
        method: "GET",
        url: `http://nodejs:3000/user?telegramId=${ctx.from.id}`,
        headers: {
          'Authorization': getSecretKey(),
        }
      });  
      log.info(`🔶 RESPONSE FROM BACK >>>:`);
      log.info(currentUser);
  
      if (!currentUser){
        ctx.reply(`Вітаю Вас! Ви тут вперше, тому пройдіть реєстрацію, будь-ласка, після чого Вам буде доступним увесь функціонал.`, ctx.scene.enter('new_user'));
        return;
      };

      ctx.wizard.state.currentUser = currentUser;
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    } catch (error) {
      log.error('🔴 bot create_demand  error -', error);
    }
  },

  async ctx => {
    await ctx.reply(`Ви вирішили створити нову заявку на донорську кров, я Вам із цим допоможу.`);
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  async ctx => {
    await ctx.reply(`Почнемо з найголовнішого: \nкров якої групи Ви потребуєте?`, Markup.keyboard([
      ['1', '2'],
      ['3', '4']
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
    log.info(ctx.wizard.state.bloodType);
    ctx.reply(`А резус-фактор?`, Markup.keyboard([      
      ['+', '-']
    ]).resize().removeKeyboard().extra());
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message.text == '+' || ctx.message.text == '-') {
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    } else {
      ctx.reply('Лише + або - ', Markup.keyboard([      
        ['+', '-']
      ]).resize().removeKeyboard().extra());
      ctx.wizard.back();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  },
  ctx => {  
    ctx.wizard.state.rhesus = ctx.message.text;
    log.info(ctx.wizard.state.rhesus);
    ctx.reply('Розкажіть, будь-ласка, для чого Вам потрібна донорська кров, а також додаткову інформацію:', Markup.removeKeyboard().extra());
    return ctx.wizard.next();
    // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.wizard.state.reason = ctx.message.text;
    log.info(ctx.wizard.state.reason);

    ctx.replyWithMarkdown(
      `*Перевірте Ваші дані*:

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
    const demand = {
      fullName: ctx.wizard.state.currentUser.fullName,
      phoneNumber: ctx.wizard.state.currentUser.phoneNumber,
      locality: ctx.wizard.state.currentUser.locality,
      bloodType: ctx.wizard.state.bloodType,
      rhesus: ctx.wizard.state.rhesus,
      reason: ctx.wizard.state.reason,
    }

    const { data: donorsList } = await axios({
      method: 'POST',
      url: `http://nodejs:3000/demand?userId=${ctx.wizard.state.currentUser.id}`,
      json: true,
      headers: { 'Authorization': getSecretKey() },
      data: demand,
    });

    log.info(donorsList);

    await ctx.replyWithHTML(`Заявку створено! 💉\nTисни /main для головного меню.`, Markup.removeKeyboard().extra());
    
    const textOfDemand = `🆕 Нова заявка!
Група крові: ${demand.bloodType}
Резус-фактор: ${demand.rhesus}
Місто: ${demand.locality}
Мета: ${demand.reason}\n
Автор: @${ctx.from.username}`;

    if (donorsList && donorsList.length) {
      try {
        donorsList.forEach(u => {
          if (u.telegramId != ctx.from.id) {
            await bot.telegram.sendMessage(u.telegramId, textOfDemand);
          }
        });
      } catch (error) {
        log.error('🔴 MAILING  error -', error);
      }
    
    }
    return ctx.scene.leave();
  }
);

module.exports = { createDemand };
