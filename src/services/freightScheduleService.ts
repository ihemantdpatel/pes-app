import FreightSchedule from "../models/freightSchedule";
import Order from "../models/order";
import connection from "../config/database";
import AppError from "../utils/appError";
import {fetchNextBatchOfOrders} from './transportService'
import { getCachedSchedule } from "./scheduleCache";
import Schedule from '../models/schedule'

interface FreightScheduleData{
  Day:number,
  DepartingLocation:string,
  ArrivalLocation:string,
  Capacity:number
}

const getFreightSchedules = (data: FreightScheduleData[]): any => {
  return data.map(freightSchedule => {
    const schedule = getCachedSchedule(freightSchedule.Day, freightSchedule.DepartingLocation, freightSchedule.ArrivalLocation);

    if(!schedule) throw new AppError("No schedule available for this day", 400)

    return {
      scheduleId:schedule.id, // Optionally keeping scheduleId if needed separately
      Capacity: freightSchedule.Capacity,
    };
  });
};


export async function bulkCreateFreightSchedules(
  reqData:FreightScheduleData[]
): Promise<FreightSchedule[]> {
  const freightSchedules = getFreightSchedules(reqData)
  const transaction = await connection.transaction(); // Start transaction
  try {
    const insertedSchedules = await FreightSchedule.bulkCreate(
      freightSchedules,
      { transaction,
        validate:true
      },
    );
    await transaction.commit();
    return insertedSchedules;
  } catch (error) {
    await transaction.rollback();
    throw new AppError(
      `Error creating freight schedules: ${(error as Error).message}`,
      400
    );
  }
}

export async function loadOrdersForFreightSchedule(
  schedule: FreightSchedule
): Promise<Order[]> {
  try {
    return await fetchNextBatchOfOrders(schedule)
  } catch (error: unknown) {
    throw new AppError((error as Error).message, 400);
  }
}

export async function getAllFreightSchedules(): Promise<FreightSchedule[]> {
  try {
    return await FreightSchedule.findAll({
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
  } catch (error: unknown) {
    throw new AppError((error as Error).message, 400);
  }
}
