import { Sequelize, Dialect } from 'sequelize';
import { DB_NAME, DB_HOST, DB_PASSWORD, DB_USERNAME, DB_PORT, DB_DIALECT, NODE_ENV, TEST_DB_NAME, TEST_DB_USERNAME,TEST_DB_PASSWORD } from './config';

const environment = NODE_ENV || 'development';

// Determine which database configuration to use based on environment
const database = environment === 'test' ? TEST_DB_NAME : DB_NAME;
const username = environment === 'test' ? TEST_DB_USERNAME : DB_USERNAME;
const password = environment === 'test' ? TEST_DB_PASSWORD : DB_PASSWORD;

let sequelizeConnection: Sequelize = new Sequelize(database, username, password, {
  host: DB_HOST,
  dialect: DB_DIALECT as Dialect,
  port: parseInt(DB_PORT),
  logging: false
});

export default sequelizeConnection;