const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../db/models');

const { strcmp } = require('./commonHandlers');
const config = require('../auth');

async function makeLogin(fields, cookie) {
  try {
    const authData = fields;

    console.log(authData);

    const checkHash = authData.hash;

    delete authData.hash;

    const dataCheck = [];

    Object.keys(authData).forEach((key) => {
      dataCheck.push(`${key}=${authData[key]}`);
    });

    dataCheck.sort();
    dataCheck.join('\n');

    const secretKey = crypto.createHash('sha256').update(config.botToken);

    const hash = crypto.createHmac('sha256', dataCheck.toString(), secretKey);

    if (strcmp(hash, checkHash) === -1) {
      throw new Error();
    }

    if (+new Date() - authData.auth_date > 86400) {
      throw new Error();
    }

    const user = await User.findOne({ where: { id: authData.id } });

    if (!user) {
      await User.create(authData);
    } else {
      await User.update({ authData }, { where: { id: authData.id } });
    }

    const token = await jwt.sign(authData, config.secret);

    cookie('tgUser', token);

    return { user: authData, cookie };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { makeLogin };
