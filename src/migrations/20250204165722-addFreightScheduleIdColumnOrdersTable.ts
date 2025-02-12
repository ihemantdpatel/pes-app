import { QueryInterface, DataTypes, literal } from "sequelize";

module.exports = {
  async up (queryInterface:QueryInterface, Sequelize:typeof DataTypes) {
    await queryInterface.addColumn(
      'orders',
      'freight_schedule_id',
      {
        allowNull:true,
        type: DataTypes.INTEGER
      }
    );
  },

  async down (queryInterface:QueryInterface, Sequelize:typeof DataTypes) {
    await queryInterface.removeColumn('orders','freight_schedule_id');
  }
};
