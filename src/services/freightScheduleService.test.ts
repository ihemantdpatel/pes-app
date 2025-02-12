import FreightSchedule from "../models/freightSchedule";
import Order from "../models/order";
import {
  bulkCreateFreightSchedules,
  getAllFreightSchedules,
  loadOrdersForFreightSchedule,
} from "../services/freightScheduleService";
import { expect, jest, beforeAll, describe, it } from "@jest/globals";
import AppError from "../utils/appError";

const mockFreightSchedules = [
  new FreightSchedule({
    DepartingLocation: "Toronto",
    ArrivalLocation: "Montreal",
    Day: 1,
    Capacity:25,
    status: "open",
  }),
  new FreightSchedule({
    DepartingLocation: "Toronto",
    ArrivalLocation: "Montreal",
    Day: 2,
    Capacity:25,
    status: "open",
  }),
];

const mockOrders = [
  new Order({ OrderNumber: 123, Destination: "Montreal", status: "pending", freightScheduleId:0 }),
  new Order({ OrderNumber: 456, Destination: "Montreal", status: "shipped", freightScheduleId:0 }),
];

describe("FreightSchedule Service", () => {
  describe("bulkCreateFreightSchedules", () => {
    it("should create freight schedules successfully and commit transaction", async () => {
      // Mocking the FreightSchedule.bulkCreateFreightSchedules method
      jest.spyOn(FreightSchedule, "bulkCreate").mockImplementation(() => {
        return Promise.resolve(mockFreightSchedules);
      });
      const result = await bulkCreateFreightSchedules(mockFreightSchedules);
      expect(result).toEqual(mockFreightSchedules);
    });
    it("should throw an error", async () => {
      // Mocking the FreightSchedule.bulkCreateFreightSchedules method
      jest
        .spyOn(FreightSchedule, "bulkCreate")
        .mockRejectedValue(new AppError("Validation error"));
      await expect(
        bulkCreateFreightSchedules(mockFreightSchedules)
      ).rejects.toThrow(AppError);
    });
  });
  describe("getAllFreightSchedules", () => {
    it("should return list of freight schedules", async () => {
      // Mocking the FreightSchedule.findAll method
      jest.spyOn(FreightSchedule, "findAll").mockImplementation(() => {
        return Promise.resolve(mockFreightSchedules);
      });
      const result = await getAllFreightSchedules();
      expect(result).toEqual(mockFreightSchedules);
    });
    it("should throw an error", async () => {
      // Mocking the FreightSchedule.findAll method
      jest
        .spyOn(FreightSchedule, "findAll")
        .mockRejectedValue(new AppError("DB Connection failed"));
      await expect(getAllFreightSchedules()).rejects.toThrow(AppError);
    });
  });
  describe("loadOrdersForFreightSchedule", () => {
    it("should return detail of freight schedule", async () => {
      // Mocking the FreightSchedule.findAll method
      jest.spyOn(FreightSchedule, "findAll").mockImplementation(() => {
        return Promise.resolve(mockFreightSchedules);
      });
      // Mocking the Order.findAll method
      jest.spyOn(Order, "findAll").mockImplementation(() => {
        return Promise.resolve(mockOrders);
      });
      const result = await loadOrdersForFreightSchedule(
        mockFreightSchedules[0]
      );
      expect(result).toEqual(mockOrders);
    });
  });
});
