import { QueryInterface, DataTypes, literal } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize:typeof DataTypes) {
    await queryInterface.createTable('drivers_schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      driver_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      schedule_id: {
        allowNull: false,
        type: DataTypes.INTEGER
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

    await queryInterface.addIndex('drivers_schedules', ['driver_id','schedule_id'], {
        name: 'idx_drivers_schedules',
        unique:false
    })
  },
  down: async (queryInterface : QueryInterface, Sequelize:typeof DataTypes) => {
    await queryInterface.dropTable('drivers_schedules');
  }
};