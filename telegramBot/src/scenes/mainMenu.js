const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const validator = require('validator');

// main menu for registrated users only
const mainMenu = new WizardScene(
  'main_menu',
)