import { Model, DataTypes } from "sequelize";
import connection from '../config/database'

interface FreightScheduleAttributes{
    id?: number,
    DepartingLocation: String,
    ArrivalLocation:String,
    Day:number,
    Capacity:number,
    status: string;

    createdAt?: Date,
    updatedAt?: Date
    deletedAt?: Date
}


class FreightSchedule extends Model<FreightScheduleAttributes> implements FreightScheduleAttributes{
    public id!: number;
    public DepartingLocation!: string;
    public ArrivalLocation!: string;
    public Day!: number;
    public Capacity!: number;
    public status!: string;

    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

FreightSchedule.init(
    {
        id:{
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.NUMBER
        },
        DepartingLocation: {
            allowNull:false,
            type: DataTypes.NUMBER
        },
        ArrivalLocation: {
            allowNull:false,
            type: DataTypes.NUMBER
        },
        Day: {
            allowNull:false,
            type: DataTypes.NUMBER,
            validate: {
            min: 1, // Must be at least 1
            max: 7, // Must be at most 7
            isInt: true, // Must be an integer
            },
        },
        Capacity: {
            allowNull:false,
            type: DataTypes.NUMBER,
            validate: {
                min: 1,
                isInt: true,
            },
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
        tableName:"freight_schedules",
        modelName:"FreightSchedule",
        freezeTableName:true
    }
);

export default FreightSchedule