'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      duration: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
              min: { args: 1, message: 'Czas trwania musi być dłuzszy od 0' }
          }
      },
      location: Sequelize.STRING,
      date: {
          type: Sequelize.DATE,
          allowNull: false
      },
      repeatInterval: Sequelize.INTEGER,
      endDate: Sequelize.DATE,
      parentEventId: {
          type: Sequelize.INTEGER,
          references: {
              model: 'events',
              key: 'id'
          }
      },
      description: Sequelize.TEXT,
      organizerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events');
  }
};
