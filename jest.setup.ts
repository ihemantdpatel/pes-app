import { execSync } from 'child_process';
import { expect, jest, beforeAll, describe, it, beforeEach,afterAll,afterEach } from "@jest/globals";
import connection from "./src/config/database";
import {server} from './src/index'
import FreightSchedule from "./src/models/freightSchedule";
import Schedule from "./src/models/schedule";

// Run migrations before all tests
beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  execSync('NODE_ENV=test npm run db:migrate && npm run db:seed', { stdio: 'inherit' });
});

// Wipe all tables before each test
beforeEach(async () => {
  await connection.transaction(async (transaction) => {
    const models = connection.models;
    const excludedTables = ["Schedule"];

    for (const [modelName, model] of Object.entries(models)) {
      if (!excludedTables.includes(modelName)) {
        await model.destroy({ where: {}, force: true, transaction });
      }
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