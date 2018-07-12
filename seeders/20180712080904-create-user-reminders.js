'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('reminder_users', [
      {
        userId: 1,
        reminderId: 1,
        date: new Date(),
        isActive: true
      },
      {
        userId: 1,
        reminderId: 2,
        date: new Date(),
        isActive: true
      },
      {
        userId: 2,
        reminderId: 1,
        date: new Date(),
        isActive: true
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('reminder_users', null, {});
  }
};
