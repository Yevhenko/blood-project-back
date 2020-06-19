const express = require('express');

const { setUser } = require('../controller');
const { setValidUser, validateRequest } = require('../validator/userValidator');

const registration = express.Router();

registration.post('/registration', validateRequest(setValidUser), async (req, res) => {
  try {
    const { body } = req;

    if (!body) {
      return res.status(404).send('Not found');
    }

    const response = await setUser(body);

    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send('The user cannot be set');
  }
});

module.exports = registration;
