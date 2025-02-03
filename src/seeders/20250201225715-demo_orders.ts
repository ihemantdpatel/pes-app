import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface : QueryInterface, Sequelize: typeof DataTypes) => {
    return queryInterface.bulkInsert('orders', [
      {
        OrderNumber: 1,
		    Destination: "Windsor",
        status:"pending"
      },
      {
        OrderNumber: 2,
		    Destination: "Ottawa",
        status:"pending"
      },
      {
        OrderNumber: 3,
		    Destination: "Montreal",
        status:"pending"
      }
    ])
  },

  down: async (queryInterface : QueryInterface, Sequelize: typeof DataTypes) => {
    return queryInterface.bulkDelete('orders' , {} , {})
  }
};
