
module.exports = (sequelize, DataTypes) => {
  const Contribution = sequelize.define('Contribution', {
    amount: DataTypes.INTEGER,
    ProjectId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
  }, {});
  Contribution.associate = function associate(models) {
    Contribution.belongsTo(models.Project);
    Contribution.belongsTo(models.User);
  };
  return Contribution;
};
