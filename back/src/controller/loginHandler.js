/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { User } = require('../db/models');

const config = require('../config');

async function makeLogin(body) {
  try {
    const { hash, ...authData } = body;
    let dataCheck = [];

    for (const key in authData) {
      dataCheck.push(`${key}=${authData[key]}`);
    }

    dataCheck = dataCheck.sort().join('\n');

    const secretKey = crypto
      .createHash('sha256')
      .update(config.botToken)
      .digest();

    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheck.toString())
      .digest('hex');

    if (hmac !== hash) {
      throw new Error('Data is NOT from Telegram');
    }

    if (new Date().getTime() - authData.auth_date * 1000 > 86400) {
      throw new Error('Data is outdated');
    }

    const user = await User.findOne({ where: { telegramId: authData.id } });

    if (!user) {
      return { user: authData.id };
    }

    const token = jwt.sign(user.toJSON(), config.secret, { expiresIn: 300 });
    const userObj = {
      id: user.id,
      bloodType: user.bloodType,
      rhesus: user.rhesus ? '+' : '-',
    };

    return { user: userObj, token };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { makeLogin };
