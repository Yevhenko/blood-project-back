const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');

const auth = express.Router();

auth.all('*', async (req, res, next) => {
  console.log('AUTH');
  if (!req.cookies) {
    res.status(500).send('auth failed');
  }

  const token = req.cookies.tgUser;

  if (token) {
    try {
      req.context = {
        user: jwt.verify(token, config.secret),
      };
    } catch (error) {
      console.log('error in auth user -', error);
      res.cookie('tgUser', '');
    }
  }

  if (!req.context || !req.context.user) {
    return res.status(500).send('auth failed');
  }

  return next();
});

module.exports = auth;
