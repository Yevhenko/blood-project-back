require('dotenv').config();
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

const settings = new WizardScene(
  'settings',
  ctx => {
    ctx.reply(`Налаштування`);
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  },
  async ctx => {
    await ctx.replyWithHTML(`⚙️`, Markup.removeKeyboard().extra());
    
    return ctx.scene.leave();
  }
);

module.exports = {
  settings,
};
