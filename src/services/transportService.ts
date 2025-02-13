import {
  DEFAULT_ORDER_STATUS,
  ASSIGNED_ORDER_STATUS,
} from "../utils/constants";
import FreightSchedule from "../models/freightSchedule";
import Order from "../models/order";
import { Op } from "sequelize";
import Schedule from '../models/schedule'

const getOrderCount = async (
  status: string = DEFAULT_ORDER_STATUS,
  freightScheduleId: number | null
): Promise<number> => {
  const whereCondition: any = {
    status: status,
  };

  // Handle `null` case explicitly
  if (freightScheduleId === null) {
    whereCondition.freightScheduleId = { [Op.is]: null };
  } else {
    whereCondition.freightScheduleId = freightScheduleId;
  }

  const count = await Order.count({
    where: whereCondition,
  });

  return count;
};

export const fetchNextBatchOfOrders = async (
  freightSchedule: FreightSchedule
): Promise<Order[]> => {
  if (freightSchedule.Capacity <= 0) return []; // Early exit if no capacity

  const remaining_capacity = freightSchedule.Capacity -
    (await getOrderCount(ASSIGNED_ORDER_STATUS, freightSchedule.id));

  if (remaining_capacity <= 0) return []; // No remaining capacity, avoid unnecessary DB call
  if(!freightSchedule.schedule) return [];
  return await Order.findAll({
    where: {
      status: DEFAULT_ORDER_STATUS,
      Destination: freightSchedule.schedule.destination,
    },
    order: [["OrderNumber", "ASC"]],
    limit: remaining_capacity,
  });
};


export const loadAllOrders = async (): Promise<{
  loaded_orders: number;
  unloaded_orders: number;
}> => {
  let loaded_orders = 0;
  let data = [];
  const freightSchedules = await FreightSchedule.findAll({
    attributes: [
      "id",
      "scheduleId",
      "Capacity",
    ],
    include: [
      {
        model: Schedule,
        as: "schedule", // Use alias defined in association
        attributes: ["id", "day", "origin", "destination"], // Select required fields
      },
    ],
  });

  for (const freightSchedule of freightSchedules) {
    const orders = await fetchNextBatchOfOrders(freightSchedule);

    if (orders && orders.length > 0) {
      const order_ids = orders.map((order) => order.id);
      loaded_orders += order_ids.length;
      await Order.update(
        {
          status: "assigned",
          freightScheduleId: freightSchedule.id,
        },
        {
          where: {
            id: order_ids,
          },
        }
      );
    }
  }

  const unloaded_orders = await getOrderCount(DEFAULT_ORDER_STATUS, null);

  return { loaded_orders, unloaded_orders };
};

export const fetchLoadedOrders = async (
  schedule: FreightSchedule
): Promise<Order[]> => {
  if (!schedule.id) return [];

  return Order.findAll({
    attributes: ["OrderNumber", "Destination", "status", "freightScheduleId"],
    where: { status: ASSIGNED_ORDER_STATUS, freightScheduleId: schedule.id },
    raw: true,
  });
};

