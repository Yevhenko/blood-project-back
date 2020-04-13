const express = require('express');

const { setUser, getUser, updateUser } = require('../controller');

const user = express.Router();

user.post('/user', async (req, res) => {
  try {
    const { body } = req;

    if (!body) {
      return res.status(404).send('Not found');
    }

    const response = await setUser(body);

    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong');
  }
});

user.get('/user', async (req, res) => {
  try {
    const userList = await getUser();
    res.send(userList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

user.put('/user', async (req, res) => {
  try {
    const { body } = req;

    if (!body) {
      return res.status(404).send('Not found');
    }

    await updateUser(body);

    return res.end('User updated!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong');
  }
});

module.exports = user;
