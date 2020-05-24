require('dotenv').config();

const botToken = process.env.BOT_TOKEN;
const secret = process.env.SECRET;
const telegramBotSecret = process.env.SECRET_KEY;

module.exports = { botToken, secret, telegramBotSecret };
