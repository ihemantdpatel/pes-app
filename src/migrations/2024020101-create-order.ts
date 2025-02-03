import { QueryInterface, DataTypes, literal } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize:typeof DataTypes) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      orderNumber: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique:true
      },
      destination: {
        allowNull: false,
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.ENUM('pending','assigned','cancelled')
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        field: 'updated_at',
      }
    });

    await queryInterface.addIndex('orders', ['orderNumber'], {
      type: 'UNIQUE',
      name: 'idx_order_number'
    })
  },
  down: async (queryInterface : QueryInterface, Sequelize:typeof DataTypes) => {
    await queryInterface.dropTable('orders');
  }
};