module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Projects',
      'reported',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Projects', 'reported');
  },
};
