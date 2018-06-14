import Sequelize from 'sequelize';

export const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: './runttausers.sqlite',
});

export const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  runttares: {
    type: Sequelize.INTEGER,
  },
});
