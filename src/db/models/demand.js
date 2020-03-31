module.exports = (sequelize, DataTypes) => {
  const Demand = sequelize.define(
    'Demand',
    {
      fullname: DataTypes.STRING,
      sex: DataTypes.STRING(1),
      phoneNumber: DataTypes.STRING(10),
      bloodType: DataTypes.STRING(1),
      rhesus: DataTypes.STRING(1),
      locality: DataTypes.STRING,
      reason: DataTypes.STRING,
    },
    {},
  );
  Demand.associate = (models) => {
    // associations can be defined here
    Demand.hasMany(models.User, { foreignKey: 'demandId', sourceKey: 'id' });
  };
  return Demand;
};
