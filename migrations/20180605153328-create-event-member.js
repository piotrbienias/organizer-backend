'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('event_members', {
      memberId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false,
        primaryKey: true
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'events',
          key: 'id'
        },
        allowNull: false,
        primaryKey: true
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('event_members');
  }
};
