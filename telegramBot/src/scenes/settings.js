const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

const settings = new WizardScene(
  'settings',
  async ctx => {
    await ctx.replyWithHTML(`⚙️`, Markup.removeKeyboard().extra());
    
    return ctx.scene.leave();
  }
);

module.exports = { settings };
