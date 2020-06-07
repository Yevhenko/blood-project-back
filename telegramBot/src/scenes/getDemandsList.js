const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const bot = require('../bot');
const axios = require('axios');

const messages = require('../helpers/messages');
const keyboards = require('../helpers/keyboards');
const { messageWithDemand } = require('../helpers/messageWithDemand');

const { getSecretKey } = require('../config');

const { logger } = require('../logger');
const log = logger(__filename);

// new user registrator five-step wizard
const getDemandsList = new WizardScene(
  'get_demands_list',
  async ctx => {
    try {
      log.info('get_demands_list');
      const { data: currentUser } = await axios({
        method: 'GET',
        url: `http://nodejs:3000/user?telegramId=${ctx.from.id}`,
        headers: {
          'Authorization': getSecretKey(),
        }
      });  
      log.info('🔴 CHECK on get_demands_list >>>:');
      log.info(currentUser);
  
      if (!currentUser) {
        ctx.reply(messages.newUser, ctx.scene.enter('new_user'));
        return;
      }

      ctx.wizard.state.currentUser = currentUser;
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    } catch (error) {
      log.error('🔴 getDemandsList', error);
    }
  },

  async ctx => {
    try {
      const { data: demandsList } = await axios({
        method: 'GET',
        url: `http://nodejs:3000/demand?userId=${ctx.wizard.state.currentUser.id}&bloodType=${ctx.wizard.state.currentUser.bloodType}&rhesus=${ctx.wizard.state.currentUser.rhesus}`,
        headers: { 'Authorization': getSecretKey() }
      });
  
      if (demandsList) {
        ctx.replyWithChatAction('typing');
        demandsList.forEach(async dem => {
          dem.rhesus = dem.rhesus ? '+' : '-';
          await ctx.replyWithMarkdown(messageWithDemand(dem), keyboards.applyButtonInline);
        });
        ctx.reply('Натисни для виходу в головне меню', keyboards.mainMenuButton);
      } else ctx.reply(messages.emptyDemandsList, keyboards.mainMenuButton);
    } catch (error) {
      log.error(`🤖 GET DEMANDS LIST error -> ${error.message}`);
    }
    return ctx.scene.leave();
  }
);

module.exports = { getDemandsList };
