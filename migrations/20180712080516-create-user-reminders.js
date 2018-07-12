'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('reminder_users', {
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false,
        primaryKey: true
      },
      reminderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'reminders',
          key: 'id'
        },
        allowNull: false,
        primaryKey: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('reminder_users');
  }
};
