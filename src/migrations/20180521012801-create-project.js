

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Projects', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    goal: {
      type: Sequelize.INTEGER,
    },
    published: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Projects'),
};
