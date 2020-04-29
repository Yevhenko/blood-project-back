// new
const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const {
  events: {
    SCENES: { NEW_USER: name },
  },
} = require('../config');
const { mainMenu, startRegistration } = require('../menu');

const stepHandler = new Composer();
stepHandler.action('contact', ctx => {
  ctx.reply(
    `Натисніть кнопку "Відправити контакт", щоби ми могли з вами зв'язатись`,
    {
      reply_markup: {
        keyboard: [
          [{ text: '📱 Відправити контакт', request_contact: true }],
          ['◀️ Назад'],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  return ctx.wizard.next();
});

const scene = new WizardScene(
  name,
  async ctx => {
    try {
      await ctx.reply(
        `Натисніть кнопку "Відправити контакт", щоби ми могли з вами зв'язатись`,
        {
          reply_markup: {
            keyboard: [
              [{ text: '📱 Відправити контакт', request_contact: true }],
              ['◀️ Назад'],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
      console.log(contact);
      console.log(ctx.message.contact.phone_number);
      stepHandler,
      ctx => {
        ctx.reply('Вітаю! Тепер Ви зареєстрований користувач BloodExchangeBot!', mainMenu);
        return ctx.scene.leave();
      }
    } catch (error) {
      ctx.reply('An error was occured(\nPlease try again later!', startRegistration);
    }
    return ctx.scene.leave();
  },
);

module.exports = {
  name,
  scene,
};

