import Order from "../models/order"
import { Response, Request } from 'express' // Import the right response and request
import {bulkCreateOrders, getAllOrders} from '../services/orderService'
import catchAsync from '../utils/catchAsync'
import AppError from "../utils/appError";
import {
    ERROR_MESSAGES,
  } from "../utils/constants";

export const getOrders = catchAsync(async (req: Request, res: Response): Promise<void> => {
    let status = req.query.status as string
    const orders = await getAllOrders(status)
    res.status(200).send(orders);
});

export const bulkInsertOrders = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const orders: Order[] = req.body;
    if(orders.length === 0){
        throw new AppError(ERROR_MESSAGES.BAD_REQUEST, 400);
    }else{
        await bulkCreateOrders(orders)
        res.status(201).end();
    }
});