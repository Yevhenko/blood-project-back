require('dotenv').config();
const { getBotToken } = require('./config');
const Telegraf = require('telegraf');

const bot = new Telegraf(getBotToken());

module.exports = bot;
