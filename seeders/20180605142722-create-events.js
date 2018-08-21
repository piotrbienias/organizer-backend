'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('events', [
      {
        name: 'Wydarzenie #1',
        duration: 30,
        location: 'Łódź',
        date: new Date(),
        createdAt: new Date(),
        organizerId: 1
      },
      {
        name: 'Wydarzenie #2',
        duration: 45,
        location: 'Łódź',
        date: new Date(),
        createdAt: new Date(),
        organizerId: 1
      },
      {
        name: 'Wydarzenie #3',
        duration: 60,
        location: 'Łódź',
        date: new Date(),
        createdAt: new Date(),
        organizerId: 1
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('events', null, {});
  }
};
