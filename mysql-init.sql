-- Create Production Database and User
CREATE DATABASE IF NOT EXISTS pes;
CREATE USER IF NOT EXISTS 'pes'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON pes.* TO 'pes'@'%';

-- Create Test Database and User
CREATE DATABASE IF NOT EXISTS pes_test;
CREATE USER IF NOT EXISTS 'pes_test'@'%' IDENTIFIED BY 'password_test';
GRANT ALL PRIVILEGES ON pes_test.* TO 'pes_test'@'%';

-- Apply changes
FLUSH PRIVILEGES;