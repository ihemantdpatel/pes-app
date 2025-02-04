import FreightSchedule from "../models/freightSchedule";
import Order from "../models/order";
import connection from "../config/database";
import AppError from "../utils/appError";
import {fetchNextBatchOfOrders} from './transportService'

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
      attributes: ["id", "DepartingLocation", "ArrivalLocation", "Day"],
    });
  } catch (error: unknown) {
    throw new AppError((error as Error).message, 400);
  }
}
