const Stage = require('telegraf/stage');

const newUser = require('./newUser');

const stage = new Stage();
stage.register(
  newUser.scene,
);


module.exports = {
  stage,
  stagesArray: [
    newUser
  ],
};