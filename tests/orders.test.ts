import request from "supertest";
import {app} from "../src/index";
import Order from "../src/models/order";
import { expect, describe, it } from "@jest/globals";

describe("Order API Integration Tests", () => {
  describe("POST /api/orders", () => {
    it("should create an order successfully", async () => {
      const response = await request(app)
        .post("/api/orders")
        .send([{
          OrderNumber: 123,
          Destination: "Vancouver",
          status: "pending",
          freightScheduleId: 1,
        }]);

      expect(response.status).toBe(201);
    });

    it("should fail to create a duplicate order", async () => {
      const order = await Order.create({
        OrderNumber: 456,
        Destination: "Toronto",
        status: "assigned",
        freightScheduleId: 2,
      });

      const response = await request(app)
        .post("/api/orders")
        .send([{
          OrderNumber: 456,
          Destination: "Toronto",
          status: "assigned",
          freightScheduleId: 2,
        }]);

      expect(response.status).toBe(400); // Should fail due to unique constraint
    });
  });

  describe("GET /api/orders", () => {
    it("should return a list of orders", async () => {
        await Order.create({
            OrderNumber: 456,
            Destination: "Toronto",
            status: "pending",
            freightScheduleId: 2,
        });
      const response = await request(app).get("/api/orders");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});