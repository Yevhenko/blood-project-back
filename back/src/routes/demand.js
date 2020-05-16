const express = require('express');

const { setDemand, deleteDemand, updateDemand } = require('../controller');
const {
  setValidDemand,
  updateValidDemand,
  validateRequest,
} = require('../validator/demandValidator');
const { auth } = require('../auth');

const demand = express.Router();

demand.post('/demand', validateRequest(setValidDemand), auth(), async (req, res) => {
  try {
    const { body } = req;

    if (!body) {
      return res.status(404).send('Not found');
    }

    const response = await setDemand(body);

    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send('The demand cannot be set');
  }
});

// demand.get('/demand', async (req, res) => {
//   try {

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('The user cannot be got');
//   }
// });

demand.put('/demand', validateRequest(updateValidDemand), async (req, res) => {
  try {
    const { body, query } = req;
    const userId = parseInt(req.query.id, 10);

    if (!userId) {
      return res.status(404).send('Not found');
    }

    await updateDemand(body, query);

    return res.end('Demand updated!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('The demand cannot be updated');
  }
});

demand.delete('/demand', async (req, res) => {
  try {
    const { query } = req;
    const userId = parseInt(req.query.id, 10);

    if (!userId) {
      return res.status(404).send('Not found');
    }

    await deleteDemand(query);

    return res.end('Demand deleted!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('The demand cannot be deleted at the moment');
  }
});

module.exports = demand;
