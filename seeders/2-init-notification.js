'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    let path = require('path');
    let fs = require('fs');
    let notidata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/json/notification.json')));
    for (let info of notidata) {
      info.createdAt = Sequelize.literal('NOW()');
      info.updatedAt = Sequelize.literal('NOW()');
    }
    return queryInterface.bulkInsert('Notifications', notidata);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Notifications', null, {});
  }
};