import { QueryInterface, DataTypes } from "sequelize";

interface schedule{
  origin:string,
  destination:string,
  day:number
}
function generateCombinations(origins: string[], destinations:string[], days: number[]) {
  const combinations:schedule[] = [];

  origins.forEach(origin => {
      destinations.forEach(destination => {
          days.forEach(day => {
              combinations.push({
                  origin,
                  destination,
                  day
              });
          });
      });
  });

  return combinations;
}

module.exports = {
  up: async (queryInterface : QueryInterface, Sequelize: typeof DataTypes) => {
    const possible_origins = ["Toronto"]
    const possible_destinations = ["Montreal", "Ottawa", "Windsor"]
    const possible_days = [1,2,3,4,5,6,7] // Monday to Sunday
    const schedules = generateCombinations(possible_origins, possible_destinations, possible_days);
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { raw: true });
    await queryInterface.sequelize.query('TRUNCATE TABLE schedules', { raw: true });
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;', { raw: true });
    return queryInterface.bulkInsert('schedules', schedules)
  },

  down: async (queryInterface : QueryInterface, Sequelize: typeof DataTypes) => {
    return queryInterface.bulkDelete('orders' , {} , {})
  }
};