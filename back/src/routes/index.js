const express = require('express');

const user = require('./user');
const demand = require('./demand');
const connection = require('./connection');
const login = require('./login');

const router = express.Router();

router.use(user, demand, connection, login);

module.exports = router;
