import { QueryInterface, DataTypes, literal } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize:typeof DataTypes) {
    await queryInterface.createTable('drivers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.ENUM('available','in-transit','unavailable')
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
  down: async (queryInterface : QueryInterface, Sequelize:typeof DataTypes) => {
    await queryInterface.dropTable('drivers');
  }
};