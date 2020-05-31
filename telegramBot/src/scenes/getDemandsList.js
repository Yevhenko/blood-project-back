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
      log.info('>>> CHECK on get_demands_list >>>:', currentUser);
      console.log('>>> CHECK on get_demands_list >>>:', currentUser);
  
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
      ctx.reply(`Заявки!`);
    
      const { data: demandsList } = await axios({
        method: 'GET',
        url: `http://nodejs:3000/demand?bloodType=${ctx.wizard.state.currentUser.bloodType}&rhesus=${ctx.wizard.state.currentUser.rhesus}`,
        headers: {
          'Authorization': getSecretKey(),
        }
      });
  
      log.info(`>>> GET DEMANDS LIST on get_demands_list >>>:, ${demandsList}`);
      
      if (demandsList.length > 0) {
        demandsList.forEach(async element => {
          await ctx.reply(`Заявка\n${element}`, Extra.HTML().markup(m =>
          m.inlineKeyboard([
            m.callbackButton('👍', '👍'),
            m.callbackButton('⭐️', '⭐️')
          ])));
    
        });
      }

  
      await ctx.replyWithMarkdown(getAdmin(),`⭐️⭐️⭐️ ${ctx.wizard.state.currentUser}`);
      
      ctx.wizard.next();
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    } catch (error) {
      log.error('bot getDemandsList function error -> ', error);
    }
    // Scene exit
    return ctx.scene.leave();
  }
);

module.exports = {
  getDemandsList,
};
