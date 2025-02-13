import { Model, DataTypes } from "sequelize";
import connection from "../config/database";
import Schedule from "./schedule"; // Import the related model
import Driver from "./driver";

export interface DriverScheduleAttributes {
  id?: number;
  scheduleId: number;
  driverId: number;
  createdAt?: Date;
  updatedAt?: Date;
  schedule?: Schedule
  driver?: Driver;
}

// Define the DriverSchedule model
class DriverSchedule extends Model<DriverScheduleAttributes> implements DriverScheduleAttributes {
  public id!: number;
  public scheduleId!: number;
  public driverId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public schedule?: Schedule;
  public driver?: Driver;
}

// Initialize the model
DriverSchedule.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    scheduleId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      field: "schedule_id",
      defaultValue: null,
    },
    driverId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: "driver_id",
        defaultValue: null,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize: connection,
    tableName: "drivers_schedules",
    modelName: "DriverSchedule",
    freezeTableName: true,
  }
);

// Define the association
DriverSchedule.belongsTo(Schedule, {
  foreignKey: "scheduleId",
  as: "schedule", // Alias for the association
});

// Schedules has many DriverSchedules
Schedule.hasMany(DriverSchedule, { foreignKey: "scheduleId", as: "driverSchedules" });
DriverSchedule.belongsTo(Schedule, { foreignKey: "scheduleId", as: "scheduleDetails" });

export default DriverSchedule;