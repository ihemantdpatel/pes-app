import FreightSchedule from "../models/freightSchedule";
import Order from "../models/order";
import { Response, Request } from "express"; // Import the right response and request
import {
  loadOrdersForFreightSchedule,
  bulkCreateFreightSchedules,
  getAllFreightSchedules,
} from "../services/freightScheduleService";
import catchAsync from "../utils/catchAsync";
import { FREIGHT_CAPACITY, ERROR_MESSAGES } from "../utils/constants";

export const getFreightSchedules = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const freightSchdules = await getAllFreightSchedules();
    res.status(200).send(freightSchdules);
  }
);

export const bulkInsertFreightSchedules = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const freightSchdules: FreightSchedule[] = req.body;
    await bulkCreateFreightSchedules(freightSchdules);
    res.status(201).end();
  }
);

export const viewFreightScheduleDetails = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const freightSchedule = await FreightSchedule.findByPk(id);
    if (freightSchedule) {
      const orders: Order[] = await loadOrdersForFreightSchedule(
        freightSchedule
      );
      res.status(200).send({
        id: freightSchedule.id,
        DepartingLocation: freightSchedule.DepartingLocation,
        ArrivalLocation: freightSchedule.ArrivalLocation,
        Day: freightSchedule.Day,
        AssignedOrders: orders.map((order) => order.OrderNumber),
        capacity: FREIGHT_CAPACITY,
        available_slots: FREIGHT_CAPACITY - orders.length,
      });
    } else {
      res.status(404).send({ error: ERROR_MESSAGES.NOT_FOUND });
    }
  }
);
