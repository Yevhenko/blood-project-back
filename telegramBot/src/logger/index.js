// LOGGER
const pino = require('pino');

const logger = fileName => {
  let name = fileName;

  if (name) {
    name = fileName.replace(/.+\/src/, '').replace(/.js$/, '');
  };

  const config = {
    showCaller: false,
    enabled: true,
    level: 'trace',
  };

  const prettyPrint = {
    colorise: true,
    translateTime: true,
    levelFirst: true,
  };

  const pinoOptions = Object.assign({}, { base: null }, config, { base: '', name, prettyPrint });

  return pino(pinoOptions);
};

module.exports = {
  logger,
};
