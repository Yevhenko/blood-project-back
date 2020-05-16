require('dotenv').config();
const { auth } = require('./auth');

const botToken = process.env.BOT_TOKEN;
const secret = process.env.SECRET;

module.exports = { botToken, secret, auth };
