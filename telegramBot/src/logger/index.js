// LOGGER
const pino = require('pino');

const logger = (fileName = '', conf = { base: null }) => {
  let name = fileName;

  if (name) {
    // name = fileName.replace(/.js$/, '');
    name = fileName.split('/src');
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

  const options = Object.assign(conf, config, { name: name[1], prettyPrint });

  return pino(options);
};

module.exports = { logger };
