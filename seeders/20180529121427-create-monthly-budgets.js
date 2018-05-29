'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('monthly_budgets', [
      {
        id: 1,
        value: 4000.00,
        year: 2018,
        month: 'Styczeń',
        createdAt: new Date()
      },
      {
        id: 2,
        value: 5000.00,
        year: 2018,
        month: 'Luty',
        createdAt: new Date()
      },
      {
        id: 3,
        value: 5500.00,
        year: 2018,
        month: 'Marzec',
        createdAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('monthly_budgets', null, {});
  }
};
