'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.OrderItem);
      Order.belongsTo(models.User);
    }
  };
  Order.init({
    userID: DataTypes.STRING,
    totalPrice: DataTypes.DECIMAL,
    paymentMethod: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};