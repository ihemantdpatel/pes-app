import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
      await queryInterface.addColumn(
        'freight_schedules',
        'capacity',
        {
          allowNull:false,
          type: DataTypes.INTEGER,
          defaultValue:0,
        }
      )
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.removeColumn('freight_schedules','capacity')
  }
};