import { Response, Request } from 'express' // Import the right response and request
import {getAllFreightSchedulesWithDriversandOrders, assignDriversToFreightSchedule, assignEmergencyDriversToFreightSchedule} from '../services/freightScheduleDriverService'
import catchAsync from '../utils/catchAsync'

export const getSchdulesDriversOrders = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const freightSchdulesDriversOrders = await getAllFreightSchedulesWithDriversandOrders()
    res.status(200).send(freightSchdulesDriversOrders);
});

export const assignDrivers = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const freightSchdulesDriversOrders = await assignDriversToFreightSchedule()
    res.status(201).end();
});

export const emergencyAssignment = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const freightSchdulesDriversOrders = await assignEmergencyDriversToFreightSchedule(parseInt(id))
    res.status(200).end("Successfully Updated");
});