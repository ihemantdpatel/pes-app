import {
    FREIGHT_CAPACITY,
    DEFAULT_FREIGHT_SCHEDULE_STATUS,
    DEFAULT_ORDER_STATUS,
    ERROR_MESSAGES,
  } from "../utils/constants";
import FreightSchedule from "../models/freightSchedule";
import Order from "../models/order";
import AppError from "../utils/appError";

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

  export const fetchNextBatchOfOrders = async (schedule: FreightSchedule):Promise<Order[]> => {
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
  }