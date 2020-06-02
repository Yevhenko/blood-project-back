/* eslint-disable object-curly-newline */
const express = require('express');

const {
  setDemandAndFilterForSending,
  getDemandsByFilter,
  deleteDemand,
  updateDemand,
} = require('../controller');
const {
  setValidDemand,
  updateValidDemand,
  validateRequest,
} = require('../validator/demandValidator');

const demand = express.Router();

demand.post('/demand', validateRequest(setValidDemand), async (req, res) => {
  try {
    const { id: userId } = req.context.user;
    const { body } = req;

    if (!body) {
      return res.status(404).send('Not found');
    }
    const response = await setDemandAndFilterForSending(body, userId);

    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send('The demand cannot be set');
  }
});

demand.get('/demand', async (req, res) => {
  try {
    const { query } = req;
    const demandBloodType = req.query.bloodType;
    const demandRhesus = req.query.rhesus;

    if (!demandBloodType && !demandRhesus) {
      res.status(404).send('Not found');
    }

    const demands = await getDemandsByFilter(query);
    res.send(demands);
  } catch (error) {
    console.error(error);
    res.status(500).send('The demands cannot be got');
  }
});

demand.put('/demand', validateRequest(updateValidDemand), async (req, res) => {
  try {
    const { body, query } = req;
    const { id: userId } = req.context.user;
    const idOfUser = parseInt(req.query.id, 10);

    if (!idOfUser) {
      return res.status(404).send('Not found');
    }

    await updateDemand(body, query, userId);

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
