const slugify = require('../utils/slugify');
const searchEngine = require('../services/search-engine');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 256],
          msg: 'Enter the project\'s title',
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    goal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          args: true,
          msg: 'Enter a valid number',
        },
        min: {
          args: 1,
          msg: 'You must have a goal higher than 0',
        },
      },
    },
    reported: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
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
    Project.hasMany(models.Contribution);
  };
  return Project;
};
