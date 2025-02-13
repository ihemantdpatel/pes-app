import { Model, DataTypes } from "sequelize";
import connection from "../config/database";
import DriverSchedule from "./driverSchedule";
import Schedule from "./schedule";

interface DriverAttributes {
  id?: number;
  name: string;
  status?: string;

  createdAt?: Date;
  updatedAt?: Date;
  driverSchedules?: DriverSchedule[];
}

class Driver extends Model<DriverAttributes> implements DriverAttributes {
  public id!: number;
  public name!: string;
  public status!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
  public driverSchedules?: DriverSchedule[];
}

Driver.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        name: "unique_name_constraint",
        msg: "Name must be unique.",
      },
      validate: {
        notEmpty: { msg: "Name cannot be empty." },
      },
    },
    status: {
      allowNull: true,
      type: DataTypes.ENUM("available", "in-transit", "unavailable"),
      defaultValue: "available",
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
    tableName: "drivers",
    modelName: "Driver",
    freezeTableName: true,
  }
);

// Drivers has many DriverSchedules
Driver.hasMany(DriverSchedule, {
  foreignKey: "driverId",
  as: "driverSchedules",
});
DriverSchedule.belongsTo(Driver, { foreignKey: "driverId", as: "driver" });

export default Driver;
