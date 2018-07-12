'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('expenses', [
      {
        id: 1,
        value: 150.00,
        description: 'Pierwszy wydatek',
        date: '2018-01-01',
        monthlyBudgetId: 1,
        createdAt: new Date()
      },
      {
        id: 2,
        value: 100.00,
        description: 'Drugi wydatek',
        date: '2018-01-01',
        monthlyBudgetId: 2,
        createdAt: new Date()
      },
      {
        id: 3,
        value: 50.00,
        description: 'Trzeci wydatek',
        date: '2018-01-01',
        monthlyBudgetId: 1,
        createdAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('expenses', null, {});
  }
};
