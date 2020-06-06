const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const bot = require('../bot');
const axios = require('axios');

const { getAdmin, getSecretKey } = require('../config');

const { logger } = require('../logger');
const log = logger(__filename);

const messages = require('../helpers/messages');
const keyboards = require('../helpers/keyboards');
const { messageWithDemand } = require('../helpers/messageWithDemand');

const demand = {};

const createDemand = new WizardScene(
  'create_demand',
  async ctx => {
    try {
      const { data: currentUser } = await axios({
        method: "GET",
        url: `http://nodejs:3000/user?telegramId=${ctx.from.id}`,
        headers: { 'Authorization': getSecretKey() }
      });  
      log.info(`🔶 RESPONSE FROM BACK >>>:`);
      log.info(currentUser);
  
      if (!currentUser){
        ctx.reply(messages.newUser, ctx.scene.enter('new_user'));
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
    await ctx.reply(messages.demandWelcome);
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.reply(messages.demandBloodType, keyboards.bloodTypes);
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
    ctx.reply(messages.rhesusQuestion, keyboards.rhesuses);
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message.text == '+' || ctx.message.text == '-') {
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    } else {
      ctx.reply(messages.rhesusQuestion, keyboards.rhesuses);
      ctx.wizard.back();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  },
  ctx => {  
    ctx.wizard.state.rhesus = ctx.message.text;
    log.info(ctx.wizard.state.rhesus);
    ctx.reply(messages.reason, keyboards.remove);
    return ctx.wizard.next();
    // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  ctx => {
    ctx.wizard.state.reason = ctx.message.text;
    log.info(ctx.wizard.state.reason);

    ctx.replyWithMarkdown(`*Перевірте Ваші дані*:\n
Група крові: ${ctx.wizard.state.bloodType}
Резус-фактор: ${ctx.wizard.state.rhesus}
Мета: ${ctx.wizard.state.reason}`, keyboards.check);
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
    };

    const { data: suitableDonors } = await axios({
      method: 'POST',
      url: `http://nodejs:3000/demand?userId=${ctx.wizard.state.currentUser.id}`,
      json: true,
      headers: { 'Authorization': getSecretKey() },
      data: demand,
    });
    
    // Sending message to admin
    bot.telegram.sendMessage(getAdmin(), `⚠\nTelegram ID: ${ctx.from.id}\nTelegram: @${ctx.from.username}`);

    // Sending message to demand-suitable donors
    if (suitableDonors && suitableDonors.length) {
      try {
        suitableDonors.forEach(async u => {
          if (+u.telegramId !== +ctx.from.id) {
            await bot.telegram.sendMessage(u.telegramId, `${messageWithDemand(demand)}\n\n@${ctx.from.username}`, keyboards.applyButtonTest);
          }
          
        });
      } catch (error) {
        log.error('🔴 MAILING  error -', error);
      }
    
    } else {
      ctx.reply(messages.emptyDonorsList);
    }

    await ctx.reply(messages.demandCongrats, keyboards.mainMenuButton);

    // Scene exit
    return ctx.scene.leave();
  }
);

module.exports = { createDemand };
