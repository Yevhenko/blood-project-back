/* eslint-disable no-plusplus */
/* eslint-disable arrow-parens */
require('dotenv').config();

const Telegraf = require('telegraf').default;

const bot = new Telegraf(process.env.TESTTOKEN);
// const session = require('telegraf/session');

bot.start(ctx => ctx.reply('W E L L C O M E!'));
// bot.catch((err, ctx) => {
//   console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
// });

bot.help(ctx => ctx.reply('Send me a sticker'));

bot.on('sticker', ctx => ctx.reply('👍👍👍'));

bot.hears('hi', ctx => ctx.reply('Hey there'));

bot.hears('?', ctx => ctx.reply('coronavirus has U!'));

bot.on('text', ctx => {
  ctx.session.counter = ctx.session.counter || 0;
  ctx.session.counter++;
  return ctx.reply(`Message counter:${ctx.session.counter}`);
});

bot.launch();
