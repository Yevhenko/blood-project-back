require('dotenv').config();
const Telegraf = require('telegraf');
const session = require('telegraf/session');
// const Router = require('telegraf/router');
const bot = require('./bot');
// const telegram = require('telegraf/telegram');
const { Stage } = require('telegraf');
const { newUser } = require('./scenes/newUser');
const { createDemand } = require('./scenes/createDemand');
// const { mainMenu } = require('./scenes/mainMenu');
// const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup');
// const { getOneUser } = require('../../../back/src/controller/userHandler');

// const { User } = require('../../back/src/db/models/');


// const { startRegistration, mainMenu } = require('./menu');

const stage = new Stage([newUser, createDemand]);

bot.use(Telegraf.log());

bot.use(session());
bot.use(stage.middleware());

bot.telegram.getMe().then((bot_informations) => {
  bot.options.username = bot_informations.username;
  console.log("Server has initialized bot nickname. Nick: "+bot_informations.username);
});

bot.start(ctx => {
  // const thisUser = await getOneUser(ctx.from.id);
  // console.log(thisUser);
  // check if there in DB any user with this telegramID

  if (ctx.from.id !== process.env.ADMIN) {
    ctx.reply(`Вітаю Вас! Ви тут вперше, тому пройдіть реєстрацію, будь-ласка, після чого Вам буде доступним увесь функціонал.`, ctx.scene.enter('new_user'));
    return;
  };
  // if (!(await db.User.findByTelegramId(ctx.update.message.from.id))) 
  // if (thisUser.id !== process.env.ADMIN) {
  //   ctx.replyWithHTML(`Вітаю Вас, ${thisUser.first_name}! Ви тут вперше, тому пройдіть реєстрацію, будь-ласка, після чого Вам буде доступним увесь функціонал.`, ctx.scene.enter('new_user'));
  // };
  // ctx.reply(`Wellcome back ${user.first_name}, please choose:\n`, ctx.scene.enter(main_menu));
});

bot.help(async ctx => {
  await ctx.replyWithMarkdown(
    `Шановні! В будь-якій незрозумілій ситуації *ЗУПИНЯЙТЕ* бота та *ЗАПУСКАЙТЕ* його знову! 
І, до речі, якщо помітили баг, то хутчіш пишіть сюди @aendrevv, або використовуйте команду /support, чи тисніть на 🤖 *Підтримка* у головному меню /main 😎`
  );
});

bot.command('main', ctx => {
  ctx.reply(`Натисни кнопочку знизу`, Markup.inlineKeyboard([
    [Markup.callbackButton('🆕 Створити нову заявку', 'create_demand')],
    [Markup.callbackButton('📋 Список усіх заявок', 'get_demands_list')],
    [Markup.callbackButton('⚙️ Налаштування', 'settings'),
    Markup.urlButton('💰 Donate', 'http://google.com')],
    [Markup.callbackButton('🤖 Підтримка', 'support')]
  ]).extra());
});

bot.action('create_demand', async ctx => {
  try {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML(`Вітаю Вас!`);

    await ctx.scene.enter('create_demand');
    
  } catch (error) {
    console.log(error.message);    
  }
});

bot.action('get_demands_list', (ctx, next) => {
  return ctx.reply('⚠️ In Progress ⚠️').then(() => next());
});

bot.action('settings', (ctx, next) => {
  return ctx.reply('⚠️ service is currently unavailable ⚠️').then(() => next());
});

bot.action('support', async ctx => {
  try {
    await ctx.reply('Напишіть, будь-ласка, максимально стисло та інформативно Ваше запитання і ми відповімо Вам так швидко, як тільки зможемо 🤗');
  } catch (error) {
    console.error();    
  }
});

bot.command('support', async ctx => {
  try {
    await ctx.reply('Напишіть, будь-ласка, максимально стисло та інформативно Ваше запитання і ми відповімо Вам так швидко, як тільки зможемо 🤗');
  } catch (error) {
    console.error();    
  }
});

// bot.on('/start', Stage.enter('new_user'));


bot.on('message', async ctx => {
  await ctx.forwardMessage(process.env.ADMIN)
});

bot.action(/.+/, ctx => {
  return ctx.answerCbQuery(`Обрано ${ctx.match[0]}! Секундочку..`)
});

// Log
console.info('⚙️ Bot is up and running ⚙️');

// test
// bot.launch();

module.exports = {
  launch: () => bot.launch(),
};