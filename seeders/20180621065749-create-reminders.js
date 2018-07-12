'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('reminders', [
      {
        name: 'First reminder',
        description: 'Description of first reminder',
        targetId: null,
        targetModel: null,
        date: new Date(),
        createdAt: new Date()
      },
      {
        name: 'Second reminder',
        description: 'Description of second reminder',
        targetId: 1,
        targetModel: 'Event',
        date: new Date(2018, 6, 20, 16, 30),
        createdAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('reminders', null, {});
  }
};
