/* eslint-disable no-unused-vars */
/* eslint-disable implicit-arrow-linebreak */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addConstraint('Demands', ['userId'], {
      type: 'foreign key',
      name: 'Demands_Users_userId_fkey',
      references: {
        // Required field
        table: 'Users',
        field: 'id',
      },
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeConstraint('Demands', 'Demands_Users_userId_fkey'),
};
