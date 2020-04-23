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
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      bloodType: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      rhesus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      locality: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastBeingDonor: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      telegramId: {
        type: Sequelize.BIGINT,
        allowNull: false,
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
