'use strict';

const { sequelize } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const path = require('path');
    const fs = require('fs');
    let products = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/json/products.json')));
    for (let product of products) {
      product.createdAt = Sequelize.literal('NOW()');
      product.updatedAt = Sequelize.literal('NOW()');
    }
    return queryInterface.bulkInsert('Products', products);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Product', null, {});
  }
};
