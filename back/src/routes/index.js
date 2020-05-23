const express = require('express');

const user = require('./user');
const demand = require('./demand');
const connection = require('./connection');
const login = require('./login');
const auth = require('./auth');

const router = express.Router();

router.use(login);
router.use(auth);
router.use(user);
router.use(demand);
router.use(connection);

module.exports = router;
