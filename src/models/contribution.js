
module.exports = (sequelize, DataTypes) => {
  const Contribution = sequelize.define('Contribution', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          args: true,
          msg: 'Enter a valid number',
        },
        min: {
          args: 1,
          msg: 'You must have an amount higher than 0',
        },
      },
    },
    ProjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  Contribution.associate = function associate(models) {
    Contribution.belongsTo(models.Project);
    Contribution.belongsTo(models.User);
  };
  return Contribution;
};
