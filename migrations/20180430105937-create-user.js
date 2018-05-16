'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(128)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(256)
      },
      userCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user_categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }).then(() => {
      return queryInterface.addIndex('users', ['id', 'deletedAt']);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
