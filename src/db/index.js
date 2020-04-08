/* eslint-disable no-unused-vars */
/* eslint-disable wrap-iife */
const { sequelize, User, Demand } = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  // await User.create({
  //   fullname: 'Yevhen Svyrydov',
  //   dateOfBirth: new Date(),
  //   sex: 'm',
  //   phoneNumber: '0672205027',
  //   email: 'soniah@mail.ru',
  //   bloodType: '1',
  //   rhesus: '-',
  //   locality: 'Cherkasy',
  //   lastBeingDonor: new Date(),
  //   photo: 'bad',
  // });
  // await Demand.create({
  //   fullname: 'Oleh Tolmachov',
  //   sex: 'm',
  //   phoneNumber: '0931927588',
  //   bloodType: '2',
  //   rhesus: '+',
  //   locality: 'Kyiv',
  //   reason: 'illness',
  // });

  try {
    await sequelize.close();
    console.log('Connection has been closed successfully.');
  } catch (error) {
    console.error('Unable to close the database connection:', error);
  }
})();
