/* eslint-disable no-unused-vars */
module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define(
    'Connection',
    {
      demandId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {},
  );
  Connection.associate = (models) => {
    // associations can be defined here
  };
  return Connection;
};
