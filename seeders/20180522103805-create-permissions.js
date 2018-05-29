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
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('permissions', null, {});
  }
};
