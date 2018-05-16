'use strict';

var bcrypt = require('bcryptjs');


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        username: 'pbienias',
        password: bcrypt.hashSync('barykada', 10),
        userCategoryId: 1,
        email: 'pbienias@gmail.com',
        createdAt: new Date().toISOString()
      },
      {
        username: 'lolopolo',
        password: bcrypt.hashSync('barykada', 10),
        userCategoryId: 2,
        email: 'lolopolo@gmail.com',
        createdAt: new Date().toISOString()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
