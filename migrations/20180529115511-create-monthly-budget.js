'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('monthly_budgets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      budget: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      year: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      month: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: 1,
                msg: 'Wartość musi być w zakresie 1-12'
            },
            max: {
                args: 12,
                msg: 'Wartość musi być w zakresie 1-12'
            }
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
    return queryInterface.dropTable('monthly_budgets');
  }
};
