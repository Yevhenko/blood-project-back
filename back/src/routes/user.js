/* eslint-disable object-curly-newline */
const express = require('express');

const { setUser, getUser, updateUser, getOneUser, deleteUser } = require('../controller');
const { setValidUser, updateValidUser, validateRequest } = require('../validator/userValidator');

const user = express.Router();

user.post('/user', validateRequest(setValidUser), async (req, res) => {
  try {
    const { body } = req;

    if (!body) {
      return res.status(404).send('Not found');
    };

    const response = await setUser(body);

    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send('The user cannot be set');
  }
});


user.get('/user', async (req, res) => {
  try {
    const userId = parseInt(req.query.id, 10);

    if (!userId) {
      const userList = await getUser();
      res.send(userList);
    } else {
      const oneUser = await getOneUser(query);
      res.send(oneUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('The user cannot be got');
  }
});

user.put('/user', validateRequest(updateValidUser), async (req, res) => {
  try {
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
