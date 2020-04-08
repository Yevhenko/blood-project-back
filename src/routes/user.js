const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../controller');

const user = express.Router();
const parser = bodyParser.json();

user.post('/user', parser, async (req, res) => {
  try {
    const { body } = req;
    if (body) {
      await controller.setUser(body);
      res.end('New user added!');
    } else {
      res.status(404).send('Not found');
    }
  } catch (error) {
    console.error('Something went wrong');
  }
});

user.get('/user', async (req, res) => {
  try {
    res.send(await controller.getUser());
  } catch (error) {
    console.error('You cannot see any users, an error occured!');
  }
});

module.exports = user;
