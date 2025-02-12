import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
      await queryInterface.addColumn(
        'freight_schedules',
        'schedule_id',
        {
          allowNull:false,
          type: DataTypes.INTEGER
        }
      );
      await queryInterface.addIndex("freight_schedules", ["schedule_id"], {
        name: "freight_schedules_schedule_id_index",
        unique: false,
      });
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    queryInterface.removeColumn('freight_schedules','schedule_id')
  }
};