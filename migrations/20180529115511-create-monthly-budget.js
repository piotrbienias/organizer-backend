'use strict';

var MonthlyBudget = require('./../build/models/monthlyBudget').default;


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('monthly_budgets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      year: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      month: {
          type: Sequelize.ENUM,
          values: MonthlyBudget.MONTH_VALUES,
          allowNull: false
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
    return queryInterface.dropTable('monthly_budgets');
  }
};
