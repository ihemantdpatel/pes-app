import { QueryInterface, DataTypes, literal } from "sequelize";

module.exports = {
  async up (queryInterface:QueryInterface, Sequelize:typeof DataTypes) {
    queryInterface.addColumn(
      'orders',
      'freight_schedule_id',
      {
        allowNull:true,
        type: DataTypes.INTEGER
      }
    );
  },

  async down (queryInterface:QueryInterface, Sequelize:typeof DataTypes) {
    queryInterface.removeColumn('orders','freight_schedule_id');
  }
};
