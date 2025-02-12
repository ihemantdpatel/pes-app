import request from "supertest";
import { app } from "../src/index";
import { expect, describe, it, beforeEach } from "@jest/globals";
import orders from "./orders.json";
import freight_schedules from "./freight_schedule.json";

// Helper function to load initial data
const loadOrders = async () => {
    // Insert orders
    const postResponse = await request(app).post("/api/orders").send(orders);

    // Ensure insertion is successful
    if (postResponse.status !== 201) {
        console.error("Failed to insert orders:", postResponse.body);
        throw new Error("Order insertion failed");
    }

    // Fetch inserted orders from DB
    return await request(app).get("/api/orders");
};

const loadFreightSchedules = async () => {
    // Insert freight schedules
    const postResponse = await request(app).post("/api/freight-schedules").send(freight_schedules);

    // Ensure insertion is successful
    if (postResponse.status !== 201) {
        console.error("Failed to insert freight schedules:", postResponse.body);
        throw new Error("Freight schedule insertion failed");
    }

    // Fetch inserted freight schedules from DB
    return await request(app).get("/api/freight-schedules");
};

const scheduleOrders = async () => await request(app).post("/api/schedule-orders");

let insertedOrders: any;
let insertedFreightSchedules: any;

beforeEach(async () => {
    insertedOrders = (await loadOrders()).body;  // Ensure API call completes before tests run
    insertedFreightSchedules = (await loadFreightSchedules()).body;
});

describe("Schedule Orders Test", () => {
    it("Should load orders into freight schedules", async () => {
        expect(insertedOrders).toHaveLength(180);
        expect(insertedFreightSchedules).toHaveLength(8);

        const response = await scheduleOrders();
        expect(response.body.loaded_orders).toBe(177);
        expect(response.body.unloaded_orders).toBe(3);
    });
});

describe("Loaded Orders Test", () => {
    it("Should fetch loaded orders for a FreightSchedule", async () => {
        expect(insertedOrders).toHaveLength(180);
        expect(insertedFreightSchedules).toHaveLength(8);

        const schedulingResponse = await scheduleOrders();
        expect(schedulingResponse.body.unloaded_orders).toBe(3);

        // Fetch loaded orders for the first freight schedule
        const response = await request(app).get(`/api/loaded-orders/${insertedFreightSchedules[0].id}`);
        expect(response.body).toHaveLength(25);
    });
});