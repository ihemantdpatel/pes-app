import FreightSchedule from "../models/freightSchedule";
import Order from "../models/order";
import connection from "../config/database";
import AppError from "../utils/appError";
import {
  FREIGHT_CAPACITY,
  DEFAULT_FREIGHT_SCHEDULE_STATUS,
  DEFAULT_ORDER_STATUS,
  ERROR_MESSAGES,
} from "../utils/constants";

export async function bulkCreateFreightSchedules(
  freightSchedules: FreightSchedule[]
): Promise<FreightSchedule[]> {
  const transaction = await connection.transaction(); // Start transaction
  try {
    const insertedSchedules = await FreightSchedule.bulkCreate(
      freightSchedules,
      { transaction }
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

const getBatchNumber = async (schedule: FreightSchedule): Promise<number> => {
  // Find the next batch
  try {
    const freightSchdules = await FreightSchedule.findAll({
      attributes: ["id", "DepartingLocation", "ArrivalLocation", "Day"],
      where: {
        status: DEFAULT_FREIGHT_SCHEDULE_STATUS,
        ArrivalLocation: schedule.ArrivalLocation,
      },
      order: [["Day", "ASC"]],
    });
    let batch = 1;
    for (let i = 0; i < freightSchdules.length; i++) {
      if (freightSchdules[i].id === schedule.id) break;
      batch++;
    }
    return batch;
  } catch (error) {
    throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
  }
};

export async function loadOrdersForFreightSchedule(
  schedule: FreightSchedule
): Promise<Order[]> {
  try {
    const batchNumber = await getBatchNumber(schedule);
    return Order.findAll({
      where: {
        status: DEFAULT_ORDER_STATUS,
        Destination: schedule.ArrivalLocation,
      },
      order: [["OrderNumber", "ASC"]],
      offset: (batchNumber - 1) * FREIGHT_CAPACITY,
      limit: FREIGHT_CAPACITY,
    });
  } catch (error: unknown) {
    throw new AppError((error as Error).message, 400);
  }
}

export async function getAllFreightSchedules(): Promise<FreightSchedule[]> {
  try {
    return await FreightSchedule.findAll({
      attributes: ["id", "DepartingLocation", "ArrivalLocation", "Day"],
    });
  } catch (error: unknown) {
    throw new AppError((error as Error).message, 400);
  }
}
