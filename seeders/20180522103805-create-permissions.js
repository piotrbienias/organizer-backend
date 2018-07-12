'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('permissions', [
      {
        id: 1,
        name: 'Moze zarządzać uzytkownikami',
        label: 'can-manage-users'
      },
      {
        id: 2,
        name: 'Moze zarządzać aktywnościami auta',
        label: 'can-manage-car-activities'
      },
      {
        id: 3,
        name: 'Moze zarządzać wydatkami',
        label: 'can-manage-monthly-budgets'
      },
      {
        id: 4,
        name: 'Moze zarządzać wydarzeniami',
        label: 'can-manage-events'
      },
      {
        id: 5,
        name: 'Moze zarządzać przypomnieniami',
        label: 'can-manage-reminders'
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('permissions', null, {});
  }
};
