const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const validator = require('validator');

// new user registrator five-step wizard
const newUser = new WizardScene(
  'new_user',
  ctx => {
    ctx.reply('Share please your contact pressing a button below', { 
      reply_markup: { 
        keyboard: [[{text: '📲 Share contact', request_contact: true}]],
        resize_keyboard: true,
        one_time_keyboard: true, 
      },
    });
    
    return ctx.wizard.next();
  },
  ctx => {
    //here will be some validation soon
    ctx.wizard.state.contact = ctx.message.contact;
    console.log(ctx.wizard.state.contact);    // enter your name
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
    ctx.wizard.state.email = ctx.message.text; // store fullName in the state
    console.log(ctx.wizard.state.email);
    
    ctx.reply(`Please enter your date of birth:`);
    return ctx.wizard.next();
  },
  ctx => {
    console.log(ctx.message.text);
    ctx.wizard.state.dob = validator.toDate(ctx.message.text);
    console.log(ctx.wizard.state.dob);
    ctx.reply(`Please choose your blood type:`, Markup.inlineKeyboard([
      Markup.callbackButton('1', () => ctx.wizard.state.bloodType = 1),
      Markup.callbackButton('2', () => ctx.wizard.state.bloodType = 2),
      Markup.callbackButton('3', () => ctx.wizard.state.bloodType = 3),
      Markup.callbackButton('4', () => ctx.wizard.state.bloodType = 4),
      Markup.callbackButton(`I don't know`, () => ctx.wizard.state.bloodType = undefined),
    ]).extra());
    return ctx.wizard.next();
  },
  ctx => {
    console.log(ctx.wizard.state.bloodType);
    ctx.reply(`Please choose your rhesus:`, Markup.inlineKeyboard([
      Markup.callbackButton('+', () => ctx.wizard.state.bloodType = '+'),
      Markup.callbackButton('-', () => ctx.wizard.state.bloodType = '-'),
      Markup.callbackButton(`I don't care:`, () => ctx.wizard.state.bloodType = undefined),
    ]).extra());
    return ctx.wizard.next();
  },  
  async ctx => {
    // ctx.replyWithDice();
    // 
    // sharing ctx.wizard.state to DB with await
    // 
    return ctx.wizard.leave();
  },
);

module.exports = {
  newUser,
};
