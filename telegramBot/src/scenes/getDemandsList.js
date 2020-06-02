const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const bot = require('../bot');
const axios = require('axios');
const Composer = require('telegraf/composer')

// const Telegraf = require('telegraf');

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
        ctx.reply(`Вітаю Вас! Ви тут вперше, тому пройдіть реєстрацію, будь-ласка, після чого Вам буде доступним увесь функціонал.`, ctx.scene.enter('new_user'));
        return;
      }

      ctx.wizard.state.currentUser = currentUser;
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    } catch (error) {
      log.error('🔴 getDemandsList function ERRROR -', error);
    }
  },

  async ctx => {
    try {
      const { data: demandsList } = await axios({
        method: 'GET',
        url: `http://nodejs:3000/demand?userId=${ctx.wizard.state.currentUser.id}&bloodType=${ctx.wizard.state.currentUser.bloodType}&rhesus=${ctx.wizard.state.currentUser.rhesus}`,
        headers: { 'Authorization': getSecretKey() }
      });
  
      log.info(demandsList);

      if (demandsList) {
        demandsList.forEach(async d => {
          const rhesus = d.rhesus ? '+' : '-';
          await ctx.replyWithMarkdown(`*Заявка від:* ${d.name}\n*Група крові:* ${d.bloodType}\n*Резус-фактор:* ${rhesus}\n*Мета:* ${d.reason}\n\n*Телефон* ${d.phoneNumber}`);
        });
      }
    } catch (error) {
      log.error(`🤖 GET DEMANDS LIST error -> ${error.message}`);
    }

    return ctx.scene.leave();
  }
);

module.exports = { getDemandsList };
