import Driver from "../models/driver";
import DriverSchedule from "../models/driverSchedule";
import Schedule from "../models/schedule";
import { getCachedSchedule } from "./scheduleCache";
import { Transaction } from "sequelize";
import connection from "../config/database";
import AppError from "../utils/appError";
import { DEFAULT_ORIGIN } from "../utils/constants";

interface driverPostData {
  name: string;
  origin: string;
  destination: string;
  days: number[];
}
const getDrivers = (data: driverPostData[]): any => {
  return data.map((driver) => {
    const schedules = driver.days.map((day) => {
      const schedule = getCachedSchedule(
        day,
        driver.origin || DEFAULT_ORIGIN,
        driver.destination
      );
      if (!schedule)
        throw new AppError("No schedule available for this day", 400);
      return {
        scheduleId: schedule.id,
      };
    });
    return {
      name: driver.name,
      driverSchedules: schedules,
    };
  });
};

export async function bulkCreateDrivers(
  reqData: driverPostData[]
): Promise<Driver[]> {
  const drivers = getDrivers(reqData);
  const transaction: Transaction = await connection.transaction(); // Start transaction
  try {
    // Bulk insert or update Drivers
    const insertedDrivers: Driver[] = [];

    for (const driver of drivers) {
      const insertDriver = await Driver.findOrCreate({
        where: { name: driver.name },
        transaction,
      });
      // Delete existing DriverSchedules for these drivers
      await DriverSchedule.destroy({
        where: {
          driverId: insertDriver[0].id,
        },
        transaction,
      });
      // Assign the ID from insertDriver array
      driver.id = insertDriver[0].id as number;

      // Prepare new driverSchedules for bulk insert
      const driverSchedules = driver.driverSchedules
        ? driver.driverSchedules.map((schedule: { scheduleId: number }) => ({
            scheduleId: schedule.scheduleId,
            driverId: driver.id,
          }))
        : [];
      // Check if driverSchedules is not empty before inserting
      if (driverSchedules.length > 0) {
        await DriverSchedule.bulkCreate(driverSchedules, {
          transaction,
          validate: true,
        });
      }
    }

    await transaction.commit(); // Commit the transaction if successful

    return insertedDrivers;
  } catch (error: unknown) {
    await transaction.rollback(); // Rollback the transaction on error
    throw new AppError((error as Error).message, 400);
  }
}

export async function getAllDrivers(): Promise<Driver[]> {
  try {
    return await Driver.findAll({
        attributes: ["id", "name", "status"],
        include: [
          {
            model: DriverSchedule,
            as: "driverSchedules",
            attributes: ["scheduleId"],
            required:true,
            include: [
              {
                model: Schedule,
                as: "scheduleDetails",
                attributes: ["day", "origin", "destination"],
                required: true,
              },
            ],
          },
        ],
      });

  } catch (error: unknown) {
    throw new AppError((error as Error).message, 400);
  }
}
