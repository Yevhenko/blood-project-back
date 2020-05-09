const session = require('telegraf/session');
const Router = require('telegraf/router');
const bot = require('./bot');
const telegram = require('telegraf/telegram');
const { Stage } = require('telegraf');
const { newUser } = require('./scenes/newUser');
const { mainMenu } = require('./scenes/mainMenu');

// const { startRegistration, mainMenu } = require('./menu');

const stage = new Stage([newUser]);


bot.use(session());
bot.use(stage.middleware());

bot.telegram.getMe().then((bot_informations) => {
  bot.options.username = bot_informations.username;
  console.log("Server has initialized bot nickname. Nick: "+bot_informations.username);
});

bot.start(ctx => {
  let user = ctx.update.message.from;
  console.log(user);
  // check if there in DB any user with this telegramID
  // if (!(await db.User.findByTelegramId(ctx.update.message.from.id))) 
  ctx.reply(`Hello ${user.first_name}! You have joined Blood-Exchange-Bot!`, ctx.scene.enter('new_user'));
  // ctx.reply(`Wellcome back ${user.first_name}, please choose:\n`, ctx.scene.enter(main_menu));
});

// bot.on('/start', Stage.enter('new_user'));

bot.on('message', (msg) => {
  console.log(msg);
  bot.telegram.sendMessage(process.env.ADMIN, msg.chat.id, msg.message_id);
  // bot.forwardMessage(process.env.ADMIN, msg.chat.id, msg.message_id);
})

bot.launch();
// Log
console.info('Bot is up and running')
