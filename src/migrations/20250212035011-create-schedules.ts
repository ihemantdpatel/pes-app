import { QueryInterface, DataTypes,literal } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      day: {
        allowNull:false,
        type: DataTypes.INTEGER
      },
      origin: {
        allowNull:false,
        type: Sequelize.STRING
      },
      destination: {
        allowNull:false,
        type: Sequelize.STRING
      },
      status: {
        type: DataTypes.ENUM('open','closed'),
        defaultValue: 'open'
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
  },
  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.dropTable('schedules');
  }
};