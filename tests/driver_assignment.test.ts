import request from "supertest";
import {app} from "../src/index";
import { expect, describe, it } from "@jest/globals";
import ordersJson from "./orders.json";
import freightSchedulesJson from "./freight_schedule.json";
import driversJson from "./drivers.json";

// Helper function to load initial data
const loadOrders = async (ordersData = ordersJson) => {
    // Insert orders
    const postResponse = await request(app).post("/api/orders").send(ordersData);

    // Ensure insertion is successful
    if (postResponse.status !== 201) {
        console.error("Failed to insert orders:", postResponse.body);
        throw new Error("Order insertion failed");
    }

    // Fetch inserted orders from DB
    return await request(app).get("/api/orders");
};

const loadFreightSchedules = async (freightSchedulesData = freightSchedulesJson) => {
    // Insert freight schedules
    const postResponse = await request(app).post("/api/freight-schedules").send(freightSchedulesData);

    // Ensure insertion is successful
    if (postResponse.status !== 201) {
        console.error("Failed to insert freight schedules:", postResponse.body);
        throw new Error("Freight schedule insertion failed");
    }

    // Fetch inserted freight schedules from DB
    return await request(app).get("/api/freight-schedules");
};

// Helper function to load initial data
const loadDrivers = async (driversData = driversJson) => {
    // Insert orders
    const postResponse = await request(app).post("/api/drivers").send(driversData);

    // Ensure insertion is successful
    if (postResponse.status !== 201) {
        console.error("Failed to insert drivers:", postResponse.body);
        throw new Error("Driver insertion failed");
    }

    // Fetch inserted orders from DB
    return await request(app).get("/api/drivers");
};

let insertedOrders: any;
let insertedFreightSchedules: any;
let insertedDrivers: any;

const assignDrivers = async () => await request(app).post("/api/drivers/assign");
const fetchDriverAssignments = async () => await request(app).get("/api/freight-schedules/details");
const emergencyDriverAssignment = async (id:number) => await request(app).post(`/api/freight-schedules/${id}/emergency-driver`);

describe("Driver Assignment", () => {
    /** ✅ Test: Create a Freight Schedule */
    it("should assign drivers successfully", async () => {
        // Load Data
        insertedFreightSchedules = (await loadFreightSchedules()).body;
        insertedDrivers = (await loadDrivers()).body;

        expect(insertedFreightSchedules).toHaveLength(8);
        expect(insertedDrivers).toHaveLength(6);

        const response = await assignDrivers();
        const driver_assignments = await fetchDriverAssignments()
        expect(driver_assignments.body).toHaveLength(5);
        expect(driver_assignments.body[0].driver.name).toBe('Anne')
        expect(driver_assignments.body[0].schedule.day).toBe(1)
        for(let i=0;i<driver_assignments.body.length;i++){
            expect(driver_assignments.body[i].freightSchedule).not.toBeNull()
        }
        const emergencyResposne = await emergencyDriverAssignment(driver_assignments.body[0].freightSchedule.id)
        expect(emergencyResposne.status).toBe(200)
    });
    it("Successful Emergency Assignment", async () => {
        // Load Data
        insertedFreightSchedules = (await loadFreightSchedules([{
            "DepartingLocation": "Toronto",
            "ArrivalLocation": "Montreal",
            "Day": 1,
            "Capacity": 25
        },
        {
            "DepartingLocation": "Toronto",
            "ArrivalLocation": "Montreal",
            "Day": 2,
            "Capacity": 25
        }])).body;
        insertedDrivers = (await loadDrivers([{
            "name": "Beck",
            "destination": "Montreal",
            "days": [
                1
            ]
        },{
            "name": "Carl",
            "destination": "Montreal",
            "days": [
                2
            ]
        },{
            "name": "Dee",
            "destination": "Montreal",
            "days": [
                3
            ]
        }])).body;

        expect(insertedFreightSchedules).toHaveLength(2);
        expect(insertedDrivers).toHaveLength(3);

        const response = await assignDrivers();
        const driver_assignments = await fetchDriverAssignments()
        expect(driver_assignments.body).toHaveLength(2);
        expect(driver_assignments.body[0].driver.name).toBe('Beck')
        expect(driver_assignments.body[0].schedule.day).toBe(1)
        for(let i=0;i<driver_assignments.body.length;i++){
            expect(driver_assignments.body[i].freightSchedule).not.toBeNull()
        }
        const emergencyResposne = await emergencyDriverAssignment(insertedFreightSchedules[1].id)
        expect(emergencyResposne.status).toBe(200)
        const updated_driver_assignments = await fetchDriverAssignments()

        expect(updated_driver_assignments.body[0].driver.name).toBe('Beck')
        expect(updated_driver_assignments.body[0].schedule.day).toBe(1)

        expect(updated_driver_assignments.body[1].driver.name).toBe('Dee')
        expect(updated_driver_assignments.body[1].schedule.day).toBe(2)

    });
    it("Failed Emergency Assignment", async () => {
        // Load Data
        insertedOrders = (await loadOrders([{
            "OrderNumber": 1,
            "Destination": "Windsor"
        },
        {
            "OrderNumber": 2,
            "Destination": "Ottawa"
        }])).body;
        insertedFreightSchedules = (await loadFreightSchedules([{
            "DepartingLocation": "Toronto",
            "ArrivalLocation": "Montreal",
            "Day": 1,
            "Capacity": 25
        },
        {
            "DepartingLocation": "Toronto",
            "ArrivalLocation": "Montreal",
            "Day": 2,
            "Capacity": 25
        }])).body;
        insertedDrivers = (await loadDrivers([{
            "name": "Beck",
            "destination": "Montreal",
            "days": [
                1,
                3
            ]
        },{
            "name": "Carl",
            "destination": "Ottawa",
            "days": [
                1,
                4
            ]
        }])).body;

        expect(insertedOrders).toHaveLength(2);
        expect(insertedFreightSchedules).toHaveLength(2);
        expect(insertedDrivers).toHaveLength(2);

        const response = await assignDrivers();
        const driver_assignments = await fetchDriverAssignments()
        expect(driver_assignments.body).toHaveLength(1);
        expect(driver_assignments.body[0].driver.name).toBe('Beck')
        expect(driver_assignments.body[0].schedule.day).toBe(1)
        for(let i=0;i<driver_assignments.body.length;i++){
            expect(driver_assignments.body[i].freightSchedule).not.toBeNull()
        }
        const emergencyResposne = await emergencyDriverAssignment(driver_assignments.body[0].freightSchedule.id)
        expect(emergencyResposne.status).toBe(500)
    });
});