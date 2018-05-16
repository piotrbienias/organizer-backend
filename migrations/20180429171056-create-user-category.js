'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_categories', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }).then(() => {
      return queryInterface.addIndex('user_categories', ['id', 'deletedAt']);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_categories');
  }
};
