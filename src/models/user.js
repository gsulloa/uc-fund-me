const bcrypt = require('bcrypt');

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, 13);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Write a valid Email.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [4, 100],
          msg: 'Write a password with a len of at least 4.',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 256],
          msg: 'Write your name.',
        },
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
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
