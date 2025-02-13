import { QueryInterface, DataTypes, literal } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize:typeof DataTypes) {
    await queryInterface.createTable('freight_schedules_drivers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      schedule_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      freight_schedule_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      driver_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.ENUM('active','inactive')
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

    await queryInterface.addIndex('freight_schedules_drivers', ['schedule_id','freight_schedule_id','driver_id','status'], {
        name: 'idx_freight_schedules_drivers_status',
        unique:true
    })
  },
  down: async (queryInterface : QueryInterface, Sequelize:typeof DataTypes) => {
    await queryInterface.dropTable('freight_schedules_drivers');
  }
};