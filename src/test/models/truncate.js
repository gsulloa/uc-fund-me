const map = require('lodash/map');
const db = require('../../models');

module.exports = async function truncate() {
  return Promise.all(map(Object.keys(db), (key) => {
    if (['sequelize', 'Sequelize'].includes(key)) return null;
    return db[key].destroy({ where: {}, force: true });
  }));
}
