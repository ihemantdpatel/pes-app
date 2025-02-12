import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    queryInterface.removeColumn('freight_schedules','DepartingLocation')
    queryInterface.removeColumn('freight_schedules','ArrivalLocation')
    queryInterface.removeColumn('freight_schedules','Day')
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addColumn(
        'freight_schedules',
        'DepartingLocation',
        {
          allowNull:false,
          type: DataTypes.STRING
        }
    );
    await queryInterface.addColumn(
        'freight_schedules',
        'ArrivalLocation',
        {
          allowNull:false,
          type: DataTypes.STRING
        }
    );
    await queryInterface.addColumn(
        'freight_schedules',
        'Day',
        {
          allowNull:false,
          type: DataTypes.INTEGER
        }
    );
  }
};