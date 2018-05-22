const bcrypt = require('bcrypt');

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, 13);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
  }, {
    hooks: {
      beforeSave: buildPasswordHash,
    },
  });
  User.associate = function associate(models) {
    User.hasMany(models.Project);
  };

  User.prototype.checkPassword = async function checkpassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
