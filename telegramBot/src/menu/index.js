const Extra = require('telegraf/extra');
const {
  buttonTexts: {
    //there will be buttons from config   
    MAIN_BUTTONS,
  },
  events: {
    //there will be buttons from config
    SCENES,
  }
} = require('../config');

const startRegistration = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton('Зареєструватися!', SCENES.NEW_USER)],
    [message.urlButton('❤️', 'http://telegraf.js.org')],
    [message.callbackButton(MAIN_BUTTONS.REGISTRATION, SCENES.REGISTRATION_MENU)],
  ]),
); 

const mainMenu = Extra.HTML().markup(message =>
  message.inlineKeyboard([
    [message.callbackButton(MAIN_BUTTONS.REGISTRATION, SCENES.REGISTRATION_MENU)],
    [message.callbackButton(MAIN_BUTTONS.REQUEST, SCENES.REQUEST_MENU)],
    [message.callbackButton(MAIN_BUTTONS.SAMPLE, SCENES.FIND_REQUESTS)],
    [message.urlButton(MAIN_BUTTONS.ABOUT, 'http://telegraf.js.org')],
  ]),
);

// const requestMenu = Extra.HTML().markup(message =>
//   message.inlineKeyboard([
//     [message.callbackButton(REQUESTS_BUTTONS.CREATE_REQUEST, SCENES.CREATE_REQUEST)],
//     [message.callbackButton(REQUESTS_BUTTONS.DELETE_REQUEST, SCENES.DELETE_REQUEST)],
//   ]),
// );

// const searchFoundMenu = Extra.HTML().markup(message =>
//   message.inlineKeyboard([
//     [message.callbackButton(BUTTON_MESSAGES.SEARCH, BUTTONS.SEARCH)],
//     [message.callbackButton(BUTTON_MESSAGES.FOUND, BUTTONS.FOUND)],
//   ]),
// );

module.exports = {
  mainMenu,
  // registrationMenu,
  // requestMenu,
  // yesNoQuestion,
  startRegistration,
  // searchFoundMenu,
  // newOrRegistrateLocation,
};
