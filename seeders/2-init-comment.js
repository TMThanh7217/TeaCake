'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    let path = require('path');
    let fs = require('fs');
    let commentdata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/json/comment.json')));
    for (let info of commentdata) {
      info.createdAt = Sequelize.literal('NOW()');
      info.updatedAt = Sequelize.literal('NOW()');
    }
    return queryInterface.bulkInsert('Comments', commentdata);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};