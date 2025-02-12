import Order from "../models/order";
import { Transaction } from "sequelize";
import connection from "../config/database";
import AppError from "../utils/appError";

export async function bulkCreateOrders(orders: Order[]): Promise<Order[]> {
  const transaction: Transaction = await connection.transaction(); // Start transaction
  try {
    const insertedOrders: Order[] = await Order.bulkCreate(orders, {
      transaction,
      validate:true
    });
    await transaction.commit(); // Commit the transaction if successful

    return insertedOrders;
  } catch (error: unknown) {
    console.log(error)
    await transaction.rollback(); // Rollback the transaction on error
    throw new AppError((error as Error).message, 400);
  }
}

export async function getAllOrders(status:string | undefined = "pending"): Promise<Order[]> {
  try {
    return await Order.findAll({
      attributes: ["OrderNumber", "Destination", "Status", "freightScheduleId"],
      where: {
        status: status,
      },
    });
  } catch (error: unknown) {
    throw new AppError((error as Error).message, 400);
  }
}
