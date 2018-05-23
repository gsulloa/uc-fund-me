const map = require('lodash/map');
const db = require('../../models');

module.exports = async function truncate(models = []) {
  return Promise.all(map(Object.keys(db), (key) => {
    if (['sequelize', 'Sequelize'].includes(key)) return null;
    if (models.length > 0 && !models.includes(key)) return null;
    return db[key].destroy({ where: {}, force: true });
  }));
};
