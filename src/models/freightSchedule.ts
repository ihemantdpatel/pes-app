import { Model, DataTypes } from "sequelize";
import connection from "../config/database";
import Schedule from "./schedule"; // Import the related model

export interface FreightScheduleAttributes {
  id?: number;
  scheduleId: number;
  Capacity: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  schedule?: Schedule
}

// Define the FreightSchedule model
class FreightSchedule extends Model<FreightScheduleAttributes> implements FreightScheduleAttributes {
  public id!: number;
  public scheduleId!: number;
  public Capacity!: number;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public schedule?: Schedule;
}

// Initialize the model
FreightSchedule.init(
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
    Capacity: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        isInt: true,
      },
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM("open", "closed"),
      defaultValue: "open",
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
    tableName: "freight_schedules",
    modelName: "FreightSchedule",
    freezeTableName: true,
  }
);

// Define the association
FreightSchedule.belongsTo(Schedule, {
  foreignKey: "scheduleId",
  as: "schedule", // Alias for the association
});

export default FreightSchedule;