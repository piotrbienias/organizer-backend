'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('monthly_budgets', [
      {
        id: 1,
        budget: 4000.00,
        year: 2018,
        month: 1,
        createdAt: new Date()
      },
      {
        id: 2,
        budget: 5000.00,
        year: 2018,
        month: 2,
        createdAt: new Date()
      },
      {
        id: 3,
        budget: 5500.00,
        year: 2018,
        month: 3,
        createdAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('monthly_budgets', null, {});
  }
};
