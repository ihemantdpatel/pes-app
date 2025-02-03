import { Sequelize, Dialect } from 'sequelize';
import { DB_NAME, DB_HOST, DB_PASSWORD, DB_USERNAME, DB_PORT, DB_DIALECT } from './config';

let sequelizeConnection: Sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT as Dialect,
  port: parseInt(DB_PORT),
  logging: false
});

export default sequelizeConnection;