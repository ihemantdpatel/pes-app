import FreightSchedule from "../models/freightSchedule"
import { Response, Request } from 'express' // Import the right response and request
import {bulkCreateFreightSchedules, getAllFreightSchedules} from '../services/freightScheduleService'
import catchAsync from '../utils/catchAsync'
import { ERROR_MESSAGES } from "../utils/constants";
import Schedule from '../models/schedule';

export const getFreightSchedules = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const freightSchdules = await getAllFreightSchedules()
    res.status(200).send(freightSchdules);
});


export const bulkInsertFreightSchedules = catchAsync(async (req: Request, res: Response): Promise<void> => {
    await bulkCreateFreightSchedules(req.body)
    res.status(201).end();
});

export const viewFreightScheduleDetails = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const freightSchedule = await FreightSchedule.findByPk(id,{
      attributes: [
        "id",
        "scheduleId",
        "Capacity",
      ],
      include: [
        {
          model: Schedule,
          as: "schedule", // Use alias defined in association
          attributes: ["day", "origin", "destination"], // Select required fields
        },
      ],
    });
    if(freightSchedule){
      res.status(200).send(freightSchedule);
    }else{
      res.status(404).json({ message: ERROR_MESSAGES.NOT_FOUND});
    }
});
