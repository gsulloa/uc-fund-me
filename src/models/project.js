

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.STRING,
    goal: DataTypes.INTEGER,
  }, {});
  Project.associate = function (models) {
    // associations can be defined here
  };
  return Project;
};
