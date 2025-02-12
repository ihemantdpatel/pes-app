require('ts-node/register');
const configs = require('./config');

const environment = configs.NODE_ENV || 'development';

const dbConfig = {
  development: {
    username: configs.DB_USERNAME,
    password: configs.DB_PASSWORD,
    database: configs.DB_NAME,
    host: configs.DB_HOST,
    dialect: configs.DB_DIALECT,
    port: configs.DB_PORT
  },
  test: {
    username: configs.TEST_DB_USERNAME,
    password: configs.TEST_DB_PASSWORD,
    database: configs.TEST_DB_NAME,
    host: configs.DB_HOST,
    dialect: configs.DB_DIALECT || 'mysql',
    port: configs.DB_PORT,
  },
  production: {
    username: configs.DB_USERNAME,
    password: configs.DB_PASSWORD,
    database: configs.DB_NAME,
    host: configs.DB_HOST,
    dialect: configs.DB_DIALECT,
    port: configs.DB_PORT
  }
};

module.exports = dbConfig[environment];
