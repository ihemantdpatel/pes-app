import Order from "../models/order";
import { bulkCreateOrders, getAllOrders } from "../services/orderService";
import { expect, jest, beforeAll, describe, it } from "@jest/globals";
import AppError from "../utils/appError";

const mockOrders = [
  new Order({ OrderNumber: 123, Destination: "Windsor", status: "pending" }),
  new Order({ OrderNumber: 456, Destination: "Toronto", status: "shipped" }),
];

describe("Order Service", () => {
  describe("bulkCreateOrders", () => {
    it("should create orders successfully and commit transaction", async () => {
      // Mocking the Order.bulkCreate method
      jest.spyOn(Order, "bulkCreate").mockImplementation(() => {
        return Promise.resolve(mockOrders);
      });
      const result = await bulkCreateOrders(mockOrders);
      expect(result).toEqual(mockOrders);
    });
    it("should throw an error", async () => {
      // Mocking the Order.bulkCreate method
      jest
        .spyOn(Order, "bulkCreate")
        .mockRejectedValue(new AppError("Validation error"));
      await expect(bulkCreateOrders(mockOrders)).rejects.toThrow(AppError);
    });
  });

  describe("getAllOrders", () => {
    it("should return list of orders", async () => {
      // Mocking the Order.findAll method
      jest.spyOn(Order, "findAll").mockImplementation(() => {
        return Promise.resolve(mockOrders);
      });
      const result = await getAllOrders();
      expect(result).toEqual(mockOrders);
    });
    it("should throw an error", async () => {
      // Mocking the Order.findAll method
      jest
        .spyOn(Order, "findAll")
        .mockRejectedValue(new AppError("DB Connection failed"));
      await expect(getAllOrders()).rejects.toThrow(AppError);
    });
  });
});
