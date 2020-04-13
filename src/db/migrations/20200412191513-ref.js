/* eslint-disable no-unused-vars */
/* eslint-disable implicit-arrow-linebreak */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addConstraint('Users', ['connectionId'], {
      type: 'foreign key',
      name: 'Users_Connections_connectionId_fkey',
      references: {
        // Required field
        table: 'Connections',
        field: 'id',
      },
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeConstraint('Users', 'Users_Connections_connectionId_fkey'),
};
