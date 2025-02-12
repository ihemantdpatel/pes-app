import dotenv from 'dotenv';

dotenv.config({ path: `./.env` }); // Load environment variables

// Type-safe environment variables
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const PORT = getEnvVar('PORT');
export const DB_USERNAME = getEnvVar('DB_USERNAME');
export const DB_PASSWORD = getEnvVar('DB_PASSWORD');
export const DB_HOST = getEnvVar('DB_HOST');
export const DB_PORT = getEnvVar('DB_PORT');
export const DB_DIALECT = getEnvVar('DB_DIALECT');
export const DB_NAME = getEnvVar('DB_NAME');
export const NODE_ENV = getEnvVar('NODE_ENV');

export const TEST_DB_USERNAME = getEnvVar('TEST_DB_USERNAME');
export const TEST_DB_PASSWORD = getEnvVar('TEST_DB_PASSWORD');
export const TEST_DB_NAME = getEnvVar('TEST_DB_NAME');