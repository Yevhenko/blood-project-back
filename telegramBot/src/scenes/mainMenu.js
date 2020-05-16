// const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
// const validator = require('validator');

// main menu for registrated users only
const mainMenu = new WizardScene(
  'main_menu',
  // in progress
  ctx => {
    ctx.reply(`in progress`);

    return ctx.wizard.next();
  },
  ctx => {
    return ctx.wizard.leave();
  }
);

module.exports = {
  mainMenu,
};
