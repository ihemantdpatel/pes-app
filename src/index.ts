// Import Express from the node_modules.
import express from 'express'
import { Express } from 'express'
import OrderRoutes from './routes/orderRoutes'
import FreightScheduleRoutes from './routes/freightScheduleRoutes'
import catchAsync from './utils/catchAsync'
import AppError from './utils/appError'
import globalErrorHandler from './controllers/errorController'
import { PORT } from './config/config';

// Create a new Express instance
const app : Express = express()

app.use(express.json())

app.use('/api/orders', OrderRoutes)
app.use('/api/freight_schedules', FreightScheduleRoutes)

app.use('*',  catchAsync(async () => {
  throw new AppError("no routes found.", 404)
}))
app.use(globalErrorHandler)
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
