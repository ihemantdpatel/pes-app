import { Model, DataTypes } from 'sequelize';
import connection from '../config/database';

interface OrderAttributes {
  id?: number;
  OrderNumber: number;
  Destination: string;
  status: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
  public id!: number;
  public OrderNumber!: number;
  public Destination!: string;
  public status!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

Order.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    OrderNumber: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    Destination: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM('pending','assigned','cancelled'),
      defaultValue: 'pending',
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
    }
  },
  {
    sequelize: connection,
    tableName:"orders",
    modelName: 'Order',
    freezeTableName:true,
    indexes: [
      {
        unique: true,
        fields: ['OrderNumber'],
      },
    ]
  }
);

export default Order;