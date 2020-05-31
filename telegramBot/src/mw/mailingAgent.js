const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const bot = require('../bot');
const axios = require('axios');
// const Telegraf = require('telegraf');

const { getAdmin, getSecretKey } = require('../config');

const { logger } = require('../logger');
const log = logger(__filename);

// * * * * * * * * * * * * * * * *
// 
// SOME CODE WILL BE HERE A.S.A.P
// 
// * * * * * * * * * * * * * * * *

module.exports = {
  mailingAgent,
};
