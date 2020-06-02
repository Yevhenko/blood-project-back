require('dotenv').config();

const { getSecretKey, getAdmin } = require('./config');
const { Stage } = require('telegraf');
const session = require('telegraf/session');
const bot = require('./bot');
// const telegram = require('telegraf/telegram');
const { settings } = require('./scenes/settings');
const axios = require('axios');

const { logger } = require('./logger');
const log = logger(__filename);

const { newUser } = require('./scenes/newUser');
const { createDemand } = require('./scenes/createDemand');
const { getDemandsList } = require('./scenes/getDemandsList');
const Markup = require('telegraf/markup');

const stage = new Stage([newUser, createDemand, getDemandsList, settings]);

// bot.use(Telegraf.log());

bot.use(session());
bot.use(stage.middleware());

// unknown magic
bot.telegram.getMe().then(bot_informations => {
  log.info(bot_informations);
  bot.options.username = bot_informations.username;
  log.info(`🤖 ${bot.options.username}`);
}).catch(e => log.error(e));

// start
bot.start(async ctx => {
  try {
    log.info(':)');
    const { data: currentUser } = await axios({
      method: "GET",
      url: `http://nodejs:3000/user?telegramId=${ctx.from.id}`,
      headers: {
        'Authorization': getSecretKey(),
      },
    });  

    log.info('🤘 START RESPONSE FROM BACK');
    log.info(currentUser);

    if (!currentUser){
      ctx.reply(`Вітаю Вас ! Ви тут вперше, тому пройдіть реєстрацію, будь-ласка, після чого Вам буде доступним увесь функціонал.`, ctx.scene.enter('new_user'));
      return;
    };
    ctx.reply(`З поверненням, ${currentUser.fullName}!`, Markup.inlineKeyboard([
      [Markup.callbackButton('🆕 Нова заявка', 'create_demand')],
      [Markup.callbackButton('📋 Актуальні заявки', 'get_demands_list')],
      [Markup.urlButton('🖥 WEB версія', `http://blood.pp.ua`)],
      [Markup.callbackButton('🤖 Підтримка', 'support'),
      Markup.callbackButton('🚪 Вийти', 'quit')]
    ]).extra())
  } catch (error) {
    log.error('🤖 START function error -', error.message);
  }
});

bot.help(async ctx => {
  await ctx.replyWithMarkdown(
    `Шановні! В будь-якій незрозумілій ситуації *ЗУПИНЯЙТЕ* бота та *ЗАПУСКАЙТЕ* його знову! 
І, до речі, якщо помітили баг, то хутчіш пишіть сюди @aendrevv, або використовуйте команду /support, чи тисніть на 🤖 *Підтримка* у головному меню /main 😎`
  );
});

bot.command('main', ctx => {
  ctx.replyWithMarkdown(`*Головне меню*`, Markup.inlineKeyboard([
    [Markup.callbackButton('🆕 Створити нову заявку', 'create_demand')],
    [Markup.callbackButton('📋 Список усіх заявок', 'get_demands_list')],
    [Markup.callbackButton('⚙️ Налаштування', 'settings'),
    Markup.urlButton('💉 Про проект', `https://github.com/Yevhenko/blood-project-back`)],
    [Markup.callbackButton('🤖 Підтримка', 'support'),
    Markup.callbackButton('🚪 Вийти', 'quit')]
  ]).extra());
});

bot.action('create_demand', async (ctx, next) => {
  try {
    await ctx.answerCbQuery();
    await ctx.scene.enter('create_demand');
    return next();
  } catch (error) {
    log.info(error.message);    
  }
});

bot.action('settings', async (ctx, next) => {
  try {
    await ctx.answerCbQuery();
    await ctx.scene.enter('settings');
    return next();
  } catch (error) {
    log.info(error.message);    
  }
});

bot.action('get_demands_list', async (ctx, next) => {
  try {
    await ctx.answerCbQuery();
    await ctx.scene.enter('get_demands_list');
    return next();
  } catch (error) {
    log.info(error.message);
  }
});

bot.action('support', async ctx => {
  try {
    await ctx.reply('Напишіть, будь-ласка, максимально стисло та інформативно Ваше запитання і ми відповімо Вам так швидко, як тільки зможемо 🤗');
  } catch (error) {
    log.error(error.message);    
  }
});

bot.command('support', async ctx => {
  try {
    await ctx.reply('Напишіть, будь-ласка, максимально стисло та інформативно Ваше запитання і ми відповімо Вам так швидко, як тільки зможемо 🤗');
  } catch (error) {
    log.error(error.message);    
  }
});

bot.command('quit', async ctx => {
  try {
    await ctx.leaveChat();
  } catch (error) {
    log.error(error.message);    
  }
});

bot.action('quit', async ctx => {
  try {
    await ctx.leaveChat();
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
