/* eslint-disable no-unused-vars */
/* eslint-disable implicit-arrow-linebreak */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Demands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      sex: {
        type: Sequelize.STRING(1),
      },
      phoneNumber: {
        type: Sequelize.STRING(10),
      },
      bloodType: {
        type: Sequelize.STRING(1),
      },
      rhesus: {
        type: Sequelize.STRING(1),
      },
      locality: {
        type: Sequelize.STRING,
      },
      reason: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Demands'),
};
