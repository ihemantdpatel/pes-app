# Paul’s Express Shipping (PES)

## 📌 Project Overview
Paul’s Express Shipping is working to streamline their manual scheduling process in order to better ensure orders arrive on time and the shipping eet is being used
most effectively

## 🛠 Tech Stack
- **Node.js** - JavaScript runtime environment
- **TypeScript** - Typed superset of JavaScript
- **Express.js** - Web framework for Node.js
- **Sequelize** - ORM for managing MySQL database
- **MySQL** - Relational database management system
- **dotenv** - For managing environment variables
- **Jest / Mocha** - Testing framework (optional)

## 📁 Project Structure
```
.
|-- tsconfig.json                                       # TypeScript configuration file
|-- docs                                                # Project Docs
|   |-- postman-collections                             # Postman collection
|   |   |-- pes-app.postman_collection.json
|-- src                                                 # Source code folder
|   |-- migrations                                      # Database migrations
|   |   |-- 2024020102-create-freight_schedule.ts
|   |   |-- 2024020101-create-order.ts
|   |-- seeders                                          # Database seeders (initial data population)
|   |   |-- 20250201225715-demo_orders.ts
|   |   |-- 20250201225721-demo_freight_schedules.ts
|   |-- index.ts                                        # Entry point of the application
|   |-- routes                                          # API route definitions
|   |   |-- orderRoutes.ts
|   |   |-- freightScheduleRoutes.ts
|   |-- config                                          # Configuration files
|   |   |-- database.ts                                 # Database connection settings
|   |   |-- sequelize.config.js                         # Sequelize configuration
|   |   |-- config.ts
|   |-- controllers                                     # Request handlers
|   |   |-- orderController.ts
|   |   |-- errorController.ts
|   |   |-- freightScheduleController.ts
|   |-- models                                          # Sequelize models (database schemas)
|   |   |-- index.ts
|   |   |-- order.ts
|   |   |-- freightSchedule.ts
|   |-- services                                        # Business logic layer
|   |   |-- orderService.ts
|   |   |-- orderService.test.ts
|   |   |-- freightScheduleService.ts
|   |   |-- freightScheduleService.test.ts
|   |-- utils                                           # Utility/helper functions
|       |-- appError.ts
|       |-- catchAsync.ts
|       |-- constants.ts
|-- docker-compose.yaml                                 # Docker Compose configuration
|-- Dockerfile                                          # Dockerfile for containerization
|-- package.json                                        # Node.js package configuration
|-- dist                                                # Compiled TypeScript files (generated after build)
|-- README.md                                           # Project documentation
```

## 🚀 Getting Started

### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** (>= 23.x)
- **MySQL** (Running instance)
- **NPM** (Node Package manager)
- **Docker**

### 2️⃣ Installation
Clone the repository and install dependencies:
```sh
git clone https://github.com/ihemantdpatel/pes-app
cd pes-app
```
To start the Docker environment, run:
```sh
docker compose up -d
```
Notes:
On the first run, Docker will pull and build images, which may take 2-5 minutes.
This is the only command needed to start the environment after the initial setup.

### 3️⃣ Environment Configuration
Create a `.env` file in the root directory and configure it as follows:
```
NODE_ENV=
PORT=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_DIALECT=
```



### 4️⃣ Database Setup
Run migrations to set up the database schema:
```sh
docker exec -it pes-app-api /bin/bash
npm run db:migrate
```
(Optional) Seed initial data:
```sh
npm run db:seed
```

### 5️⃣ Start the Server (Local)
Run the development server:
```sh
npm run install
npm run dev
```
For production:
```sh
npm run install
npm run build
npm run start
```

## 🧪 Running Tests
To execute tests, run:
```sh
npm run test
```

## 📜 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/orders` | Fetch all Orders |
| GET | `/api/freight_schedules` | Fetch all Freight Schedules |
| POST | `/api/orders` | Bulk Insert Orders |
| POST | `/api/freight_schedules` | Bulk Insert Freight Schedules |
| GET | `/api/freight_schedules/:id` | View Freight Schedule with Assigned Orders |

## Postman Collection

This repository includes a Postman collection for easy API testing and documentation.

### Usage
1. Install [Postman](https://www.postman.com/downloads/).
2. Import the collection from the `docs/postman-collections/` folder.
3. Run the requests to interact with the API.