const express = require('express');

const user = require('./user');
const demand = require('./demand');

const router = express.Router();

router.use(user, demand);

module.exports = router;
