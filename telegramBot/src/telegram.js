require('dotenv').config();
const Telegram = require('telegraf/telegram');

const telegram = new Telegraf(process.env.BOT_TOKEN);

module.exports = bot;
