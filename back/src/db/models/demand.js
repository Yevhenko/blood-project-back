module.exports = (sequelize, DataTypes) => {
  const Demand = sequelize.define(
    'Demand',
    {
      fullName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      bloodType: DataTypes.STRING(1),
      rhesus: DataTypes.BOOLEAN,
      locality: DataTypes.STRING,
      reason: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {},
  );
  Demand.associate = (models) => {
    // associations can be defined here
    Demand.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
    Demand.belongsToMany(models.User, {
      through: 'Connection',
      as: 'users',
      foreignKey: 'demandId',
      otherKey: 'userId',
    });
  };
  return Demand;
};
