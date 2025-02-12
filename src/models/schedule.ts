import { Model, DataTypes } from "sequelize";
import connection from '../config/database'

export interface ScheduleAttributes{
    id?: number,
    day:number,
    origin: String,
    destination:String,
    status: string;

    createdAt?: Date,
    updatedAt?: Date
}


class Schedule extends Model<ScheduleAttributes> implements ScheduleAttributes{
    public id!: number;
    public day!: number;
    public origin!: string;
    public destination!: string;
    public status!: string;

    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Schedule.init(
    {
        id:{
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.NUMBER
        },
        day: {
            allowNull:false,
            type: DataTypes.NUMBER,
            validate: {
                min: 1, // Must be at least 1
                max: 7, // Must be at most 7
                isInt: true, // Must be an integer
            },
        },
        origin: {
            allowNull:false,
            type: DataTypes.NUMBER
        },
        destination: {
            allowNull:false,
            type: DataTypes.NUMBER
        },
        status: {
          allowNull: false,
          type: DataTypes.ENUM('open','closed'),
          defaultValue: 'open',
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    },
    {
        sequelize:connection,
        tableName:"schedules",
        modelName:"Schedule",
        freezeTableName:true
    }
);

export default Schedule