/* eslint-disable object-curly-newline */
const express = require('express');

const { updateUser, getOneUser, deleteUser } = require('../controller');
const { updateValidUser, validateRequest } = require('../validator/userValidator');

const user = express.Router();

user.get('/user', async (req, res) => {
  try {
    const { query } = req;
    const userTelegramId = parseInt(req.query.telegramId, 10);

    if (!userTelegramId) {
      res.status(404).send('Not found!');
    } else {
      const oneUser = await getOneUser(query);
      res.status(200).send(oneUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('The user cannot be got');
  }
});

user.put('/user', validateRequest(updateValidUser), async (req, res) => {
  try {
    const { body, query } = req;
    const userId = parseInt(req.query.id, 10);

    if (!userId) {
      return res.status(404).send('Not found');
    }

    await updateUser(body, query);

    return res.end('User updated!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('The user cannot be updated');
  }
});

user.delete('/user', async (req, res) => {
  try {
    const { query } = req;
    const userId = parseInt(req.query.id, 10);

    if (!userId) {
      return res.status(404).send('Not found');
    }

    await deleteUser(query);

    return res.end('User deleted!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('The user cannot be deleted at the moment');
  }
});

module.exports = user;
