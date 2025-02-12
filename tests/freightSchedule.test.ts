import request from "supertest";
import {app} from "../src/index";
import FreightSchedule from "../src/models/freightSchedule";
import { expect, describe, it } from "@jest/globals";

describe("Freight Schedule API Tests", () => {
  let scheduleId: number;

  /** ✅ Test: Create a Freight Schedule */
  it("should create a new freight schedule", async () => {
    const response = await request(app).post("/api/freight-schedules").send([{
        "DepartingLocation": "Toronto",
        "ArrivalLocation": "Montreal",
        "Day": 1,
        "Capacity": 25
    }]);
    expect(response.status).toBe(201);
  });

  /** ✅ Test: Fetch All Freight Schedules */
  it("should get all freight schedules", async () => {
    await FreightSchedule.create({
        scheduleId: 3,
        Capacity: 25,
        status: "open",
      });
    const response = await request(app).get("/api/freight-schedules");
    console.log(response.body)
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  /** ✅ Test: Fetch a Single Freight Schedule */
  it("should get details of a specific freight schedule", async () => {
    const freightSchedule = await FreightSchedule.create({
        scheduleId: 3,
        Capacity: 25,
        status: "open",
      });
    const response = await request(app).get(`/api/freight-schedules/${freightSchedule.id}`);
    console.log(response.body)
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(freightSchedule.id);
  });

  /** ✅ Test: Handle Not Found Case */
  it("should return 404 if schedule not found", async () => {
    const response = await request(app).get("/api/freight-schedules/9999");
    expect(response.status).toBe(404);
  });

  /** ✅ Test: Validate Bad Request */
  it("should return 400 for invalid data", async () => {
    const response = await request(app).post("/api/freight-schedules").send([{
      DepartingLocation: "",
      ArrivalLocation: "",
      Day: "Monday", // Invalid type
      Capacity: "large", // Invalid type
      status: "pending", // Invalid enum
    }]);

    expect(response.status).toBe(400);
  });
});