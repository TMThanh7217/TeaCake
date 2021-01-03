'use strict';

const bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

module.exports = {
  up: (queryInterface, Sequelize) => {

    let path = require('path');
    let fs = require('fs');
    let userdata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/json/userdata.json')));
    for (let info of userdata) {
      info.createdAt = Sequelize.literal('NOW()');
      info.updatedAt = Sequelize.literal('NOW()');
    }
    return queryInterface.bulkInsert('Users', userdata);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

