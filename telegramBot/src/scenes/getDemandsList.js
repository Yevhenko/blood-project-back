const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const bot = require('../bot');
const axios = require('axios');

// const Telegraf = require('telegraf');

const { getAdmin, getSecretKey } = require('../config');

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
      log.error('bot getDemandsList function error -', error);
    }
  },

  async ctx => {
    try {
      const { data: demandsList } = await axios({
        method: 'GET',
        url: `http://nodejs:3000/demand?userId=${ctx.wizard.state.currentUser.id}&bloodType=${ctx.wizard.state.currentUser.bloodType}&rhesus=${ctx.wizard.state.currentUser.rhesus}`,
        headers: {
          'Authorization': getSecretKey(),
        }
      });
  
      log.info(`⭐️ GET DEMANDS LIST:`);
      log.info(demandsList);

      if (demandsList) {
        log.info('demandsList is available');
        demandsList.forEach(async d => {
          const rhesus = d.rhesus ? '+' : '-';
          await ctx.replyWithMarkdown(`*Заявка від:* ${d.name}\n*Група крові:* ${d.bloodType}\n*Резус-фактор:* ${rhesus}\n*Мета:* ${d.reason}`);
        });
      }
  
      await ctx.reply(getAdmin(),`⭐️ ${ctx.wizard.state.currentUser}`);
    } catch (error) {
      log.error(`bot GET DEMANDS LIST error -> ${error.message}`);
      log.error(error);
    }
    // Scene exit
    return ctx.scene.leave();
  }
);

module.exports = { getDemandsList };
