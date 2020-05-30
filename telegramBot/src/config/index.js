let telegramConfig = {
  botToken: '',
  admin: '',
  port: 0,
  secretKey: '',
}

const initConfig = options => {
  telegramConfig ={
    botToken: options.BOT_TOKEN,
    admin: options.ADMIN,
    port: options.PORT,
    secretKey: options.SECRET_KEY,
  };
  console.log('CONFIG:', telegramConfig);
};

const getBotToken = () =>{
  if (!telegramConfig.botToken) throw 'botToken not found';

  return telegramConfig.botToken;
}

const getAdmin = () =>{
  if (!telegramConfig.admin) throw 'admin not found';

  return telegramConfig.admin;
}

const getPort = () =>{
  if (!telegramConfig.port) throw 'port not found';

  return telegramConfig.port;
}

const getSecretKey = () =>{
  if (!telegramConfig.secretKey) throw 'secretKey not found';

  return telegramConfig.secretKey;
}

module.exports = {
  initConfig,
  getBotToken,
  getAdmin,
  getPort,
  getSecretKey
}
