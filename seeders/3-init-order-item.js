'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    let path = require('path');
    let fs = require('fs');
    let order_itemdata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/json/order_item.json')));
    for (let info of order_itemdata) {
      info.createdAt = Sequelize.literal('NOW()');
      info.updatedAt = Sequelize.literal('NOW()');
    }
    return queryInterface.bulkInsert('OrderItems', order_itemdata);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderItems', null, {});
  }
};