require('dotenv').config();
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Router = require('telegraf/router');
const bot = require('./bot');
const telegram = require('telegraf/telegram');
const { Stage } = require('telegraf');
const { newUser } = require('./scenes/newUser');
const { createDemand } = require('./scenes/createDemand');
const { mainMenu } = require('./scenes/mainMenu');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

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
  let user = ctx.update.message.from;
  console.log(user);
  // check if there in DB any user with this telegramID
  // if (!(await db.User.findByTelegramId(ctx.update.message.from.id))) 
  if (user.id != process.env.ADMIN) {
    ctx.replyWithHTML(`Вітаю Вас, пане ${user.first_name}!`, ctx.scene.enter('new_user'));
  };
  // ctx.reply(`Wellcome back ${user.first_name}, please choose:\n`, ctx.scene.enter(main_menu));
});

bot.command('main', ctx => {
  ctx.reply(`Натисни кнопочку знизу`, Markup.inlineKeyboard([
    [Markup.callbackButton('🆕 Create a new Demand', 'create_demand')],
    [Markup.callbackButton('📋 Get the Demands List', 'get_demands_list')],
    [Markup.callbackButton('⚙️ Settings', 'settings'),
    Markup.urlButton('💰 Donate', 'http://google.com')],
    [Markup.callbackButton('🤖 Support', 'support')]
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

// bot.on('/start', Stage.enter('new_user'));


bot.on('message', async ctx => {
  await ctx.forwardMessage(process.env.ADMIN)
});

bot.action(/.+/, ctx => {
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
});

bot.launch();
// Log
console.info('⚙️ Bot is up and running ⚙️')
