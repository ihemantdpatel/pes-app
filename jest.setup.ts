import { execSync } from 'child_process';
import { expect, jest, beforeAll, describe, it, beforeEach,afterAll } from "@jest/globals";
import connection from "./src/config/database";
import {server} from './src/index'
// Run migrations before all tests
beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  execSync('NODE_ENV=test npm run db:migrate', { stdio: 'inherit' });
});

// Wipe all tables before each test
beforeEach(async () => {
  await connection.transaction(async (transaction) => {
    const models = connection.models;
    for (const model of Object.values(models)) {
      await model.destroy({ where: {}, force: true, transaction });
    }
  });
});

// Close the database connection after all tests
afterAll(async () => {
  await connection.close();
  server.close(() => {
    console.log("✅ Server stopped.");
  });
});