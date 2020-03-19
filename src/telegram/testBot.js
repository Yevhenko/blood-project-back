/* eslint-disable no-plusplus */
const TelegramBot = require('node-telegram-bot-api');

const token = '746353040:AAEI_tYU2rs9Ztzbq8sgC8qyYiIYoQcrYGY';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/test/, (msg) => {
  const userId = msg.from.id;

  bot.sendMessage(userId, 'Coronavirus!');
});
