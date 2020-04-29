const session = require('telegraf/session');
const Router = require('telegraf/router');
const bot = require('./bot');
const { stage, stagesArray } = require('./scenes');
const { startRegistration, mainMenu } = require('./menu');

bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => {
  // if (!(await getUserId({ platformId: ctx.update.message.from.id, platformType: TELEGRAM }))) {
  //   ctx.reply(WELCOME_MESSAGE, startRegistration);
  //   return;
  // }
  ctx.reply(`Hello! You have joined 'Blood-Exchange-Bot ^__^'`, startRegistration);
  // ctx.reply(ALREADY_REGISTRATED, mainMenu);
});

bot.launch();
