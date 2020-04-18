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
    Connection.hasMany(models.User, { foreignKey: 'demandId', targetKey: 'id' });
    Connection.belongsTo(models.Demand, { foreignKey: 'demandId', targetKey: 'id' });
  };
  return Connection;
};
