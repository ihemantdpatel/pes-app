// Import Express from the node_modules.
import express from 'express'
import { Express } from 'express'
import OrderRoutes from './routes/orderRoutes'
import FreightScheduleRoutes from './routes/freightScheduleRoutes'
import scheduleOrders from './routes/scheduleOrders'
import catchAsync from './utils/catchAsync'
import AppError from './utils/appError'
import globalErrorHandler from './controllers/errorController'
import { PORT } from './config/config';
import { loadSchedulesIntoCache } from "./services/scheduleCache";
import connection from "./config/database";

// Create a new Express instance
export const app : Express = express()

app.use(express.json())

app.use('/api/orders', OrderRoutes)
app.use('/api/freight-schedules', FreightScheduleRoutes)
app.use('/api', scheduleOrders)

app.use('*',  catchAsync(async () => {
  throw new AppError("no routes found.", 404)
}))
app.use(globalErrorHandler)

// Start the server and store the instance
export const server = app.listen(PORT, async () => {
  await connection.authenticate()
  await loadSchedulesIntoCache();
});
