const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { User } = require('../db/models');
const { strcmp } = require('./commonHandlers');

const config = require('../config');

async function makeLogin(body) {
  try {
    const { hash: checkHash, ...authData } = body;
    const dataCheck = [];

    Object.keys(authData).forEach((key) => {
      dataCheck.push(`${key}=${authData[key]}`);
    });

    dataCheck.sort().join('\n');

    const secretKey = crypto.createHash('sha256').update(config.botToken);
    const hash = crypto.createHmac('sha256', dataCheck.toString(), secretKey);

    if (strcmp(hash, checkHash) === -1) {
      throw new Error('Data is NOT from Telegram');
    }

    // if (new Date().getTime() - authData.auth_date > 86400) {
    //   throw new Error('Data is outdated');
    // }

    const user = await User.findOne({ where: { telegramId: authData.telegramId } });

    if (!user) {
      return { user: authData.telegramId, msg: 'User not found' };
    }

    const token = jwt.sign(user.toJSON(), config.secret);

    return { user: authData, token };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { makeLogin };
