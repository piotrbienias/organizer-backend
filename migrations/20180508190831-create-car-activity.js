'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('car_activities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      activityName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
          type: Sequelize.DATE,
          allowNull: false
      },
      price: Sequelize.DECIMAL(10, 2),
      place: Sequelize.STRING,
      currentCourse: Sequelize.INTEGER,
      additionalInfo: Sequelize.TEXT,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('car_activities');
  }
};
