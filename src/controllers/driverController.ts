import Order from "../models/order"
import { Response, Request } from 'express' // Import the right response and request
import {bulkCreateDrivers, getAllDrivers} from '../services/driverServices'
import catchAsync from '../utils/catchAsync'
import AppError from "../utils/appError";
import {
    ERROR_MESSAGES,
  } from "../utils/constants";

export const getDrivers = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const drivers = await getAllDrivers()
    res.status(200).send(drivers);
});

export const bulkInsertDrivers = catchAsync(async (req: Request, res: Response): Promise<void> => {
    await bulkCreateDrivers(req.body)
    res.status(201).end();
});