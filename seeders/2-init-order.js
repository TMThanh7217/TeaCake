// 'use strict';

// module.exports = {
//   up: (queryInterface, Sequelize) => {

//     let path = require('path');
//     let fs = require('fs');
//     let orderdata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/json/order.json')));
//     for (let info of orderdata) {
//       info.createdAt = Sequelize.literal('NOW()');
//       info.updatedAt = Sequelize.literal('NOW()');
//     }
//     return queryInterface.bulkInsert('Orders', orderdata);
//   },

//   down: async (queryInterface, Sequelize) => {
//     return queryInterface.bulkDelete('Orders', null, {});
//   }
// };

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    let path = require('path');
    let fs = require('fs');
    let orderdata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/json/order.json')));
    for (let info of orderdata) {
      info.createdAt = Sequelize.literal('NOW()');
      info.updatedAt = Sequelize.literal('NOW()');
    }
    return queryInterface.bulkInsert('Orders', orderdata);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {});
  }
};