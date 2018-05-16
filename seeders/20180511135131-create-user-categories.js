'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user_categories', [
      {
        name: 'Administrator',
        createdAt: new Date().toISOString()
      },
      {
        name: 'Uzytkownik',
        createdAt: new Date().toISOString()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_categories', null, {});
  }
};
