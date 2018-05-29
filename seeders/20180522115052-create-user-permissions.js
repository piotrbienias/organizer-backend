'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user_permissions', [
      {
        userId: 1,
        permissionId: 1
      },
      {
        userId: 1,
        permissionId: 2
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_permissions', null, {});
  }
};
