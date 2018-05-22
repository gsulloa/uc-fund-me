

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    name: DataTypes.STRING,
    projectId: DataTypes.INTEGER,
  }, {});
  Image.associate = function associate(models) {
    Image.belongsTo(models.Project);
  };
  return Image;
};
