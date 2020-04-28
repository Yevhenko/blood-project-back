/* eslint-disable no-plusplus */
/* eslint-disable arrow-parens */
require('dotenv').config();

const Telegraf = require('telegraf');
const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

const stepHandler = new Composer();
stepHandler.action('next', ctx => {
  ctx.reply('Хороший выбор! Еще бухнешь?');
  return ctx.wizard.next();
});
stepHandler.command('next', ctx => {
  ctx.reply('Хороший выбор');
  return ctx.wizard.next();
});
stepHandler.use(ctx => ctx.replyWithMarkdown('Нажми на кнопку!'));

const superWizard = new WizardScene(
  'super-wizard',
  ctx => {
    ctx.reply(
      'Чего изволите?',
      Markup.inlineKeyboard([
        // Markup.urlButton('❤️', 'http://telegraf.js.org'),
        Markup.callbackButton('🍺', 'next'),
        Markup.callbackButton('🍷', 'next'),
        Markup.callbackButton('🥃', 'next'),
        // Markup.callbackButton('➡️ Next', 'next'),
      ]).extra()
    );
    return ctx.wizard.next();
  },
  stepHandler,
  // ctx => {
  //   ctx.reply('Step 3');
  //   return ctx.wizard.next();
  // },
  // ctx => {
  //   ctx.reply('Step 4');
  //   return ctx.wizard.next();
  // },
  ctx => {
    ctx.reply('Опять напился, мразь?');
    return ctx.scene.leave();
  }
);

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Stage([superWizard], { default: 'super-wizard' });
bot.use(session());
bot.use(stage.middleware());
bot.launch();
