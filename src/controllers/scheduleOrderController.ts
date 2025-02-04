import { Response, Request } from 'express' // Import the right response and request
import catchAsync from '../utils/catchAsync'
import {loadAllOrders, fetchLoadedOrders} from '../services/transportService'
import FreightSchedule from "../models/freightSchedule"
import { ERROR_MESSAGES } from "../utils/constants";

export const scheduleOrdersOnToTheTransport = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const data =  await loadAllOrders()
    res.status(200).send({
        'loaded_orders': data['loaded_orders'],
        'unloaded_orders': data['unloaded_orders']
    });
});


export const loadedOrders = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const freightSchedule = await FreightSchedule.findByPk(id);
    if(freightSchedule){
        const orders = await fetchLoadedOrders(freightSchedule)
        res.status(200).send(orders);
    }else{
        res.status(404).json({ message: ERROR_MESSAGES.NOT_FOUND});
      }
});