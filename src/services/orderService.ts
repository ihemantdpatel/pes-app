import Order from "../models/order";
import { Transaction } from "sequelize";
import connection from "../config/database";
import AppError from "../utils/appError";

export async function bulkCreateOrders(orders: Order[]): Promise<Order[]> {
  const transaction: Transaction = await connection.transaction(); // Start transaction
  try {
    const insertedOrders: Order[] = await Order.bulkCreate(orders, {
      transaction,
    });
    await transaction.commit(); // Commit the transaction if successful

    return insertedOrders;
  } catch (error: unknown) {
    await transaction.rollback(); // Rollback the transaction on error
    throw new AppError((error as Error).message, 400);
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    return await Order.findAll({
      attributes: ["OrderNumber", "Destination", "Status"],
    });
  } catch (error: unknown) {
    throw new AppError((error as Error).message, 400);
  }
}
