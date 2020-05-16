module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      fullName: DataTypes.STRING,
      dateOfBirth: DataTypes.DATEONLY,
      phoneNumber: DataTypes.STRING,
      email: DataTypes.STRING,
      bloodType: DataTypes.STRING(1),
      rhesus: DataTypes.BOOLEAN,
      locality: DataTypes.STRING,
      lastBeingDonor: DataTypes.DATEONLY,
      telegramId: DataTypes.BIGINT,
    },
    {},
  );
  User.associate = (models) => {
    // associations can be defined here
    User.hasMany(models.Demand, { foreignKey: 'userId', sourceKey: 'id' });
    User.belongsToMany(models.Demand, { through: 'Connection' });
  };
  return User;
};
