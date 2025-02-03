import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    queryInterface.bulkInsert('freight_schedules', [
      {
        DepartingLocation: "Toronto",
        ArrivalLocation: "Montreal",
        Day: "1",
        status:"open"
      },
      {
        DepartingLocation: "Toronto",
        ArrivalLocation: "Ottawa",
        Day: "1",
        status:"open"
      },
      {
        DepartingLocation: "Toronto",
        ArrivalLocation: "Windsor",
        Day: "1",
        status:"open"
      }
    ])
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    queryInterface.bulkDelete('freight_schedules', {}, {})
  }
};
