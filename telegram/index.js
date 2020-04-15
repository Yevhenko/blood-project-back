const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

const userData = {};

const messageOptions = {
  parse_mode: 'HTML',
  disable_web_page_preview: false,
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: 'Хочу бути донором',
          callback_data: 'donor',
        },
        {
          text: 'Мені потрібна кров',
          callback_data: 'blood',
        },
      ],
    ],
  }),
};

bot.onText(new RegExp('/start'), (message) => {
  const clientId = Object.prototype.hasOwnProperty.call(message, 'chat')
    ? message.chat.id
    : message.from.id;
  bot.sendMessage(clientId, 'Доброго дня, пане, Вас вітає Кревний Бот!', messageOptions);
});

bot.on('callback_query', (message) => {
  const clientId = Object.prototype.hasOwnProperty.call(message, 'chat')
    ? message.chat.id
    : message.from.id;
  if (message.data === 'donor') {
    bot.sendMessage(clientId, "Введіть своє ім'я");
  }
  if (message.data === 'blood') {
    bot.sendMessage(clientId, 'З якої причини Вам потрібна кров?');
  }
});

bot.setWebHook(`https://api.telegram.org/bot${token}`);

console.log(userData);
