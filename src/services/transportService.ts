import {
  FREIGHT_CAPACITY,
  DEFAULT_FREIGHT_SCHEDULE_STATUS,
  DEFAULT_ORDER_STATUS,
  ASSIGNED_ORDER_STATUS,
  ERROR_MESSAGES,
} from "../utils/constants";
import FreightSchedule from "../models/freightSchedule";
import Order from "../models/order";
import AppError from "../utils/appError";

const getOrderCount = async (status:string  = DEFAULT_ORDER_STATUS, freightScheduleId:number): Promise<number> => {
  const count = await Order.count({
    where: {
      status: status,
      freightScheduleId: freightScheduleId
    },
  });
  console.log(count)
  return count
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

export const fetchNextBatchOfOrders = async (
  schedule: FreightSchedule
): Promise<Order[]> => {
  const batchNumber = await getBatchNumber(schedule);
  const loaded_orders = await getOrderCount(ASSIGNED_ORDER_STATUS, schedule.id)
  const remaining_capacity = schedule.Capacity - loaded_orders
  console.log(schedule.Capacity)

  return Order.findAll({
    where: {
      status: DEFAULT_ORDER_STATUS,
      Destination: schedule.ArrivalLocation,
    },
    order: [["OrderNumber", "ASC"]], // Prioritize by order number
    limit: remaining_capacity, // Assign 25 orders per transport
  });
};

export const loadAllOrders = async (): Promise<{
  loaded_orders: number;
  unloaded_orders: number;
}> => {
  let loaded_orders = 0;
  let data = [];
  const shedules = await FreightSchedule.findAll({
    attributes: ["id", "DepartingLocation", "ArrivalLocation", "Day", "Capacity"],
  });

  for (const schedule of shedules) {
    const orders = await fetchNextBatchOfOrders(schedule);

    if (orders && orders.length > 0) {
      const order_ids = orders.map((order) => order.id);
      loaded_orders += order_ids.length;
      await Order.update(
        {
          status: "assigned",
          freightScheduleId: schedule.id,
        },
        {
          where: {
            id: order_ids,
          },
        }
      );
    }
  }

  const unloaded_orders = await Order.count({
    where: {
      status: DEFAULT_ORDER_STATUS,
    },
  });

  return { loaded_orders, unloaded_orders };
};


export const fetchLoadedOrders = async (
  schedule: FreightSchedule
): Promise<Order[]> => {
  return await Order.findAll({
    attributes: ["OrderNumber", "Destination", "Status", "freightScheduleId"],
    where: {
      status: ASSIGNED_ORDER_STATUS,
      freightScheduleId: schedule.id,
    },
  });
};