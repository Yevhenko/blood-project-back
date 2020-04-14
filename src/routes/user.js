/* eslint-disable object-curly-newline */
const express = require('express');

const { setUser, getUser, updateUser, getOneUser, deleteUser } = require('../controller');

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
    const { query } = req;
    console.log(query);
    if (!query) {
      const userList = await getUser();
      res.send(userList);
    } else {
      const oneUser = await getOneUser(query);
      res.send(oneUser);
    }
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

user.delete('/user', async (req, res) => {
  try {
    const { body } = req;

    if (!body) {
      return res.status(404).send('Not found');
    }

    await deleteUser(body);

    return res.end('User deleted!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Something went wrong');
  }
});

module.exports = user;
