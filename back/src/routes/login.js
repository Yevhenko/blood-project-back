const express = require('express');

const { auth } = require('../auth');

const login = express.Router();
const { makeLogin } = require('../controller');

login.post('/login', auth(), async (req, res) => {
  try {
    const { fields, cookie } = req;

    if (!fields) {
      return res.status(404).send('Not found');
    }

    const response = await makeLogin(fields, cookie);

    return res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Some troubles with login');
  }
});

module.exports = login;
