const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const validator = require('validator');

// new user registrator five-step wizard
const newUser = new WizardScene(
  'new_user',
  async ctx => {
    ctx.reply('Send me your number please', { 
      reply_markup: { 
        keyboard: [[{text: '📲 Send phone number', request_contact: true}]],
        resize_keyboard: true,
        one_time_keyboard: true, 
      },
    });
    ctx.wizard.state.contact = ctx.message.contact;
    console.log(ctx.wizard.state.contact);
    return ctx.wizard.next();
  },
  ctx => {
    ctx.reply("Please, tell me your FULL name"); 
    // enter your name
    return ctx.wizard.next();
  },
  (ctx) => {
    // validation example
    if (ctx.message.text.length < 2) {
      ctx.reply('Please enter your real name');
      return ctx.wizard.prev();
    } else return ctx.wizard.next();
  },  
  ctx => {
    ctx.wizard.state.fullName = ctx.message.text; // store fullName in the state to share data between middlewares
    ctx.reply(`Please enter your email:`);
    return ctx.wizard.next();
  },
  ctx => {
    console.log(ctx.message.text);
    if (validator.isEmail(ctx.message.text)) {
      ctx.wizard.state.email = ctx.message.text;    
      ctx.reply(`Enter your DOB:`, Markup.inlineKeyboard([
        Markup.callbackButton(`I don't know`, () => ctx.wizard.state.dob = '01011990'),
      ]).extra());
      return ctx.wizard.next();
    } else return ctx.wizard.prev();
  },
  ctx => {
    ctx.wizard.state.email = ctx.message.text; // store fullName in the state to share data between middlewares
    console.log(ctx.wizard.state.email);
    
    ctx.reply(`Please enter your date of birth:`);
    return ctx.wizard.next();
  },
  ctx => {
    console.log(ctx.message.text);
    if (validator.toDate(ctx.message.text)) {
      ctx.wizard.state.dob = ctx.message.text;    
      ctx.reply(`Please choose your blood type:`, Markup.inlineKeyboard([
        Markup.callbackButton('1', () => ctx.wizard.state.bloodType = 1),
        Markup.callbackButton('2', () => ctx.wizard.state.bloodType = 2),
        Markup.callbackButton('3', () => ctx.wizard.state.bloodType = 3),
        Markup.callbackButton('4', () => ctx.wizard.state.bloodType = 4),
        Markup.callbackButton(`I don't know`, () => ctx.wizard.state.bloodType = undefined),
      ]).extra());
      return ctx.wizard.next();
    } else return ctx.wizard.prev();
  },
  ctx => {
    // ctx.replyWithDice();
    // 
    return ctx.wizard.leave();
  },
);

module.exports = {
  newUser,
};
