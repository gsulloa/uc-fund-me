const slugify = require('../utils/slugify');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.STRING,
    goal: DataTypes.INTEGER,
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    hooks: {
      beforeCreate: (project) => {
        const slug = slugify(project.title);
        // eslint-disable-next-line no-param-reassign
        project.slug = `${slug}-${uuid()}`;
      },
    },
  });
  Project.associate = function associate(models) {
    Project.hasMany(models.Image);
    Project.belongsTo(models.User);
  };
  return Project;
};
