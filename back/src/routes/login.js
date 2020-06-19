const express = require('express');

const { makeLogin } = require('../controller');

const login = express.Router();

login.post('/login', async (req, res) => {
  try {
    const { body } = req;
    console.log('Body in login endpoint:', body);

    if (!body) {
      return res.status(404).send('Not found');
    }

    const response = await makeLogin(body);
    const { token } = response;
    res.cookie('tgUser', token);
    res.header.authorization = token;

    return res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errorMessage: error.message || 'Something went wrong' });
  }
});

module.exports = login;
