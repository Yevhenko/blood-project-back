const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');

const auth = express.Router();

auth.all('*', async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(500).send('auth failed');
  }

  const token = req.headers.authorization;

  if (token === config.telegramBotSecret) {
    req.context = {
      user: {
        id: parseInt(req.query.userId, 10),
      },
    };
    return next();
  }

  try {
    req.context = {
      user: jwt.verify(token, config.secret),
    };
  } catch (error) {
    console.log('error in auth user -', error);
  }

  if (!req.context || !req.context.user) {
    return res.status(500).send('auth failed');
  }

  return next();
});

module.exports = auth;
