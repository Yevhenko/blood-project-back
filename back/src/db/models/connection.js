module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define(
    'Connection',
    {
      demandId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {},
  );
  // eslint-disable-next-line no-unused-vars
  Connection.associate = (models) => {
    // associations can be defined here
  };
  return Connection;
};
