const { Telegraf } = require('telegraf');
const { Stage, Markup } = require('telegraf');
const session = require('telegraf/session');
const axios = require('axios');
const bot = require('./bot');
const { getSecretKey, getAdmin } = require('./config');

const { logger } = require('./logger');

const log = logger(__filename);

const { newUser } = require('./scenes/newUser');
const { createDemand } = require('./scenes/createDemand');
const { getDemandsList } = require('./scenes/getDemandsList');
const { settings } = require('./scenes/settings');

const messages = require('./helpers/messages');
const keyboards = require('./helpers/keyboards');

const stage = new Stage([newUser, createDemand, getDemandsList, settings]);

bot.use(Telegraf.log());
bot.use(session());

bot.use(stage.middleware());

bot.telegram
  .getMe()
  .then(bot_informations => {
    log.info(bot_informations.username);
  })
  .catch(e => log.error(e));

// start
bot.start(async ctx => {
  try {
    await ctx.reply('Accepted!', keyboards.mainMenuButton);
  } catch (error) {
    log.error(`🤖 START ->>  ${error.message}`);
  }
});

bot.action('apply', async ctx => {
  try {
    const { data: currentUser } = await axios({
      method: 'POST',
      url: `http://nodejs:3000/connection?telegramId=${ctx.from.id}`,
      headers: { Authorization: getSecretKey() },
    });
    log.info('🤘 START RESPONSE FROM BACK');

    if (!currentUser) {
      ctx.reply(messages.newUser, ctx.scene.enter('new_user'));
      return;
    }
    await ctx.reply('🤖', keyboards.applyButton);

    // ctx.reply(`З поверненням, ${currentUser.fullName}!`, keyboards.mainMenu)
  } catch (error) {
    log.error(`🤖 START ->>  ${error.message}`);
  }});

bot.help(async ctx => {
  await ctx.reply(messages.help, keyboards.applyButton);
});

bot.command('main', ctx => {
  ctx.replyWithMarkdown(`*Головне меню*`, keyboards.mainMenu);
});

bot.action('main', ctx => {
  ctx.editMessageCaption() (`Головне меню`, keyboards.mainMenu);
});

bot.action('create_demand', async (ctx, next) => {
  try {
    await ctx.scene.enter('create_demand');
    return next();
  } catch (error) {
    log.info(error.message);
  }
});

bot.action('settings', async (ctx, next) => {
  try {
    await ctx.scene.enter('settings');
    return next();
  } catch (error) {
    log.info(error.message);
  }
});

bot.action('get_demands_list', async (ctx, next) => {
  try {
    await ctx.scene.enter('get_demands_list');
    return next();
  } catch (error) {
    log.info(error.message);
  }
});

bot.action('support', async ctx => {
  try {
    await ctx.reply(messages.support, keyboards.mainMenuButton);
  } catch (error) {
    log.error(error.message);
  }
});

bot.command('support', async ctx => {
  try {
    await ctx.reply(messages.support, keyboards.mainMenuButton);
  } catch (error) {
    log.error(error.message);
  }
});

bot.on('message', async ctx => {
  try {
    await ctx.forwardMessage(getAdmin());
  } catch (error) {
    log.error(error.message);
  }
});

bot.action(/.+/, ctx => {
  return ctx.answerCbQuery(`${ctx.match[0]}...`);
});

log.info('🤖 Bot is up and running!');

module.exports = {
  launch: () => bot.launch(),
};
