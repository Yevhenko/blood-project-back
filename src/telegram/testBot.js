/* eslint-disable no-plusplus */
require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TESTTOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/test/, (msg) => {
  const userId = msg.from.id;

  bot.sendMessage(userId, 'Wake up, Neo. \nCoronavirus has you!!');
});
