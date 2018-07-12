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
      },
      {
        userId: 1,
        permissionId: 3
      },
      {
        userId: 1,
        permissionId: 4
      },
      {
        userId: 1,
        permissionId: 5
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_permissions', null, {});
  }
};
