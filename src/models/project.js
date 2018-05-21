const slugify = require('../utils/slugify');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.STRING,
    goal: DataTypes.INTEGER,
  }, {
    hooks: {
      beforeCreate: (project) => {
        const slug = slugify(project.title);
        // eslint-disable-next-line no-param-reassign
        project.slug = `${slug}-${uuid()}`;
      },
    },
  });
  Project.associate = function (models) {
    // associations can be defined here
  };
  return Project;
};
