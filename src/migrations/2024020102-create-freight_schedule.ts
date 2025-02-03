import { QueryInterface, DataTypes, literal } from "sequelize";

module.exports = {
    async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes){
        await queryInterface.createTable('freight_schedules' , {
            id:{
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            DepartingLocation: {
                allowNull:false,
                type: DataTypes.STRING
            },
            ArrivalLocation: {
                allowNull:false,
                type: DataTypes.STRING
            },
            Day: {
                allowNull:false,
                type: DataTypes.INTEGER
            },
            status: {
              type: DataTypes.ENUM('open','closed')
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
        })
    },
    async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes){
        await queryInterface.dropTable('freight_schedules')
    }
}