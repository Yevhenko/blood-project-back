module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      fullname: DataTypes.STRING,
      dateOfBirth: DataTypes.DATEONLY,
      sex: DataTypes.STRING(1),
      phoneNumber: DataTypes.STRING(10),
      email: DataTypes.STRING,
      bloodType: DataTypes.STRING(1),
      rhesus: DataTypes.STRING(1),
      locality: DataTypes.STRING,
      lastBeingDonor: DataTypes.DATE,
      photo: DataTypes.STRING,
      demandId: DataTypes.BIGINT,
    },
    {},
  );
  User.associate = (models) => {
    // associations can be defined here
    User.belongsTo(models.Demand, { foreignKey: 'demandId', targetKey: 'id' });
  };
  return User;
};
