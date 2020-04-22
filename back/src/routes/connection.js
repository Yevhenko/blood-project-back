const express = require('express');

const { setConnection, deleteConnection } = require('../controller');

const connection = express.Router();

connection.post('/connection', async (req, res) => {
  try {
    const { body } = req;

    if (!body) {
      return res.status(400).send('Not found');
    }

    const response = await setConnection(body);

    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send('The connection cannot be set');
  }
});

connection.delete('/connection', async (req, res) => {
  try {
    const userId = parseInt(req.query.id, 10);

    if (!userId) {
      return res.status(404).send('Not found');
    }

    await deleteConnection(query);

    return res.end('Connection deleted!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('The Connection cannot be deleted at the moment');
  }
});
