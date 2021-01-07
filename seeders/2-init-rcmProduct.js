'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    let path = require('path');
    let fs = require('fs');
    let RcmProduct = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/json/RcmProduct.json')));
    for (let info of RcmProduct) {
      info.createdAt = Sequelize.literal('NOW()');
      info.updatedAt = Sequelize.literal('NOW()');
    }
    return queryInterface.bulkInsert('RcmProducts', RcmProduct);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RcmProducts', null, {});
  }
};