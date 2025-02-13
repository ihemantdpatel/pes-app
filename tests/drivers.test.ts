import request from "supertest";
import {app} from "../src/index";
import Driver from "../src/models/driver";
import { expect, describe, it } from "@jest/globals";
import { resolve } from "path";

describe("Drivers API Integration Tests", () => {
  describe("POST /api/drivers", () => {
    it("should create a driver successfully", async () => {
      const response = await request(app)
        .post("/api/drivers")
        .send([{
            "name": "Anne",
            "destination": "Montreal",
            "days": [
                1,
                3
            ]
        }]);

      expect(response.status).toBe(201);
    });

    it("should update driver if already exist", async () => {
        let response = await request(app)
        .post("/api/drivers")
        .send([{
            "name": "Anne",
            "destination": "Montreal",
            "days": [
                1,
                3
            ]
        }]);
        expect(response.status).toBe(201);

        response = await request(app).get("/api/drivers");

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].name).toBe('Anne')
        expect(response.body[0].status).toBe('active')
        expect(response.body[0].driverSchedules[0].scheduleDetails.day).toBe(1)
        expect(response.body[0].driverSchedules[1].scheduleDetails.day).toBe(3)

        response = await request(app).post("/api/drivers").send([{
            "name": "Anne",
            "destination": "Montreal",
            "days": [
                1,
                3
            ]
        }]);

        response = await request(app).get("/api/drivers");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].name).toBe('Anne')
        expect(response.body[0].status).toBe('active')
        expect(response.body[0].driverSchedules[0].scheduleDetails.day).toBe(1)
        expect(response.body[0].driverSchedules[1].scheduleDetails.day).toBe(3)
    });
  });

  describe("GET /api/drivers", () => {
    it("should return a list of drivers", async () => {
        let response = await request(app)
        .post("/api/drivers")
        .send([{
            "name": "Anne",
            "destination": "Montreal",
            "days": [
                1,
                3
            ]
        }]);
      response = await request(app).get("/api/drivers");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});