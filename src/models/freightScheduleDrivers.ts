import { Model, DataTypes } from "sequelize";
import connection from "../config/database";
import Schedule from "./schedule";
import Driver from "./driver";
import FreightSchedule from "./freightSchedule";

export interface FreightScheduleDriverAttributes {
  id?: number;
  scheduleId: number;
  freightScheduleId: number;
  driverId: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  schedule?: Schedule;
}

class FreightScheduleDriver
  extends Model<FreightScheduleDriverAttributes>
  implements FreightScheduleDriverAttributes
{
  public id!: number;
  public scheduleId!: number;
  public freightScheduleId!: number;
  public driverId!: number;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public schedule?: Schedule;

   // BeforeCreate Hook for Validation
   static async validateUniqueCombination(instance: FreightScheduleDriver) {
    const existingEntry = await FreightScheduleDriver.findOne({
      where: {
        driverId: instance.driverId,
        freightScheduleId: instance.freightScheduleId,
        scheduleId:instance.scheduleId
      },
    });

    if (existingEntry) {
      throw new Error(`Driver ${instance.driverId} is already assigned to Freight Schedule ${instance.freightScheduleId}`);
    }
  }
}

// Initialize the model
FreightScheduleDriver.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    scheduleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: "schedule_id",
    },
    freightScheduleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: "freight_schedule_id",
    },
    driverId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: "driver_id",
    },
    status: {
        allowNull: true,
        type: DataTypes.ENUM("assigned", "completed","cancelled"),
        defaultValue: "active",
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
    tableName: "freight_schedules_drivers",
    modelName: "FreightScheduleDriver",
    freezeTableName: true,
  }
);

// Define the association
FreightScheduleDriver.belongsTo(Schedule, {
  foreignKey: "scheduleId",
  as: "schedule", // Alias for the association
});

// Define the association
FreightScheduleDriver.belongsTo(FreightSchedule, {
  foreignKey: "freightScheduleId",
  as: "freightSchedule", // Alias for the association
});

// Define the association
FreightScheduleDriver.belongsTo(Driver, {
  foreignKey: "driverId",
  as: "driver", // Alias for the association
});
export default FreightScheduleDriver;
