import FreightScheduleDriver from "../models/freightScheduleDrivers";
import Driver from "../models/driver";
import Order from "../models/order";
import AppError from "../utils/appError";
import Schedule from "../models/schedule";
import FreightSchedule from "../models/freightSchedule";
import DriverSchedule from "../models/driverSchedule";
import Sequelize from "sequelize";
import connection from "../config/database";
import { Op, QueryTypes } from "sequelize";

interface nextAvailableDriver {
  id: number;
  name: String;
  next_available_day: number;
}

const getNextAvailableDriver = async (
  freightScheduleId: number,
  driverId:number
): Promise<nextAvailableDriver | null> => {
  const query = `
        SELECT d.id, d.name, MIN(ABS(s.day - sch.day)) AS next_available_day
FROM drivers d
JOIN drivers_schedules ds ON d.id = ds.driver_id and d.id <> ${driverId}
JOIN schedules s ON ds.schedule_id = s.id
JOIN freight_schedules fs ON fs.id = ${freightScheduleId}
JOIN schedules sch ON fs.schedule_id = sch.id
LEFT JOIN freight_schedules_drivers fsd
    ON fsd.driver_id = d.id AND fsd.freight_schedule_id = fs.id
WHERE fsd.driver_id IS NULL AND s.destination = sch.destination  and s.day > sch.day
GROUP BY d.id, d.name
ORDER BY next_available_day
LIMIT 1`;

  const result = await connection.query(query, {
    replacements: { freightScheduleId },
    type: QueryTypes.SELECT,
  });

  return result.length > 0 ? (result[0] as nextAvailableDriver) : null;
};

export async function getAllFreightSchedulesWithDriversandOrders(): Promise<
  FreightScheduleDriver[]
> {
  try {
    return await FreightScheduleDriver.findAll({
      attributes: ["id"],
      include: [
        {
          model: Schedule,
          as: "schedule",
          attributes: ["day", "origin", "destination"],
        },
        {
          model: Driver,
          as: "driver",
          attributes: ["name"],
        },
        {
          model: FreightSchedule,
          as: "freightSchedule",
          attributes: ["id", "capacity"],
          include: [
            {
              model: Order,
              as: "orders",
              attributes: ["orderNumber"],
              required: false,
            },
          ],
        },
      ],
      order: [[Sequelize.col("freightSchedule.id"), "ASC"]],
    });
  } catch (error) {
    throw new AppError(
      `Error fetching freight schedule details: ${(error as Error).message}`,
      400
    );
  }
}

export async function assignDriversToFreightSchedule(): Promise<void> {
  const freightSchedules = await FreightSchedule.findAll({
    attributes: ["id", "scheduleId", "Capacity"],
    include: [
      {
        model: Schedule,
        as: "schedule",
        attributes: ["id", "day", "origin", "destination"],
      },
    ],
  });
  const transaction = await connection.transaction(); // Start transaction
  const assignedDriverIds: number[] = [];
  try {
    for (const freightSchedule of freightSchedules) {
      // Delete existing FreightScheduleDriver
      await FreightScheduleDriver.destroy({
        where: {
          freightScheduleId: freightSchedule.id,
        },
        transaction,
      });

      // Fetch available drivers
      const drivers = await DriverSchedule.findAll({
        where: {
          scheduleId: freightSchedule.schedule?.id,
          driverId: { [Op.notIn]: assignedDriverIds },
        },
        transaction,
        include: [
          {
            model: Driver,
            as: "driver",
            attributes: ["id", "name"],
            required: true,
          },
        ],
        order: [[Sequelize.col("driver.id"), "ASC"]],
      });
      // Create FreightScheduleDriver entry
      if (drivers.length && freightSchedule.schedule && drivers[0].driver) {
        const freightScheduleDriver = await FreightScheduleDriver.create(
          {
            freightScheduleId: freightSchedule.id,
            driverId: drivers[0].driver.id,
            scheduleId: freightSchedule.schedule.id,
          },
          { transaction }
        );
        assignedDriverIds.push(drivers[0].driver.id);
      }
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new AppError(
      `Error creating freight schedules driver: ${(error as Error).message}`,
      400
    );
  }
}

export async function assignEmergencyDriversToFreightSchedule(
  id: number
): Promise<void> {
  const freightSchedule = await FreightSchedule.findByPk(id, {
    attributes: ["id", "scheduleId", "Capacity"],
    include: [
      {
        model: Schedule,
        as: "schedule",
        attributes: ["id"],
      },
    ],
  });
  if (!freightSchedule)
    throw new AppError("Freight Schedule doesn't exist", 400);
  if (freightSchedule.schedule) {
    const freightScheduleDriver = await FreightScheduleDriver.findOne({
      where: {
        freightScheduleId: freightSchedule.id,
        scheduleId: freightSchedule.schedule.id,
      },
    });
    if (freightScheduleDriver) {
      // Fetch available drivers
      const result = await getNextAvailableDriver(freightSchedule.id, freightScheduleDriver.driverId);
      if (result) {
        await freightScheduleDriver.update({ driverId: result.id });
      } else {
        throw new AppError("No driver replacement found", 500);
      }
    }
  } else {
    throw new AppError("Schedule doesn't attached to a Freight Schedule", 500);
  }
}