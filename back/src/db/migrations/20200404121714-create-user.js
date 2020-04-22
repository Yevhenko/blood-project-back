/* eslint-disable no-unused-vars */
/* eslint-disable implicit-arrow-linebreak */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
      },
      phoneNumber: {
        type: Sequelize.STRING(10),
      },
      email: {
        type: Sequelize.STRING,
      },
      bloodType: {
        type: Sequelize.STRING(1),
      },
      rhesus: {
        type: Sequelize.BOOLEAN,
      },
      locality: {
        type: Sequelize.STRING,
      },
      lastBeingDonor: {
        type: Sequelize.DATEONLY,
      },
      telegramId: {
        type: Sequelize.BIGINT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
