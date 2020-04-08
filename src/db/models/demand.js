module.exports = (sequelize, DataTypes) => {
  const Demand = sequelize.define(
    'Demand',
    {
      fullName: DataTypes.STRING,
      sex: DataTypes.STRING(1),
      phoneNumber: DataTypes.STRING(10),
      bloodType: DataTypes.STRING(1),
      rhesus: DataTypes.STRING(1),
      locality: DataTypes.STRING,
      reason: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {},
  );
  Demand.associate = (models) => {
    // associations can be defined here
    Demand.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
    Demand.hasMany(models.Connection, { foreignKey: 'demandId', sourceKey: 'id' });
  };
  return Demand;
};
