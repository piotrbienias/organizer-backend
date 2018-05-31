'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('expenses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notNull: { msg: 'Wartość wydatku jest obowiązkowa' }
        }
      },
      date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          validate: {
              notNull: { msg: 'Data wydatku jest obowiązkowa' }
          }
      },
      description: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
              notNull: { msg: 'Opis wydatku jest obowiązkowy' }
          }
      },
      monthlyBudgetId: {
          type: Sequelize.INTEGER,
          references: {
              model: 'monthly_budgets',
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }).then(() => {
      return queryInterface.addIndex('expenses', ['id', 'deletedAt']).then(() => {
        return queryInterface.addIndex('expenses', ['monthlyBudgetId', 'deletedAt']);
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('expenses');
  }
};
