module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      fullName: DataTypes.STRING,
      dateOfBirth: DataTypes.DATEONLY,
      sex: DataTypes.STRING(1),
      phoneNumber: DataTypes.STRING(10),
      email: DataTypes.STRING,
      bloodType: DataTypes.STRING(1),
      rhesus: DataTypes.STRING(1),
      locality: DataTypes.STRING,
      lastBeingDonor: DataTypes.DATE,
      photo: DataTypes.STRING,
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
