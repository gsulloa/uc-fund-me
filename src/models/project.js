const slugify = require('../utils/slugify');
const searchEngine = require('../services/search-engine');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 256],
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
      beforeValidate: (project) => {
        const slug = slugify(project.title);
        // eslint-disable-next-line no-param-reassign
        project.slug = `${slug}-${uuid()}`;
      },
      afterCreate: (project) => {
        searchEngine.addObject(project);
      },
    },
  });
  Project.associate = function associate(models) {
    Project.hasMany(models.Image);
    Project.belongsTo(models.User);
  };
  return Project;
};
