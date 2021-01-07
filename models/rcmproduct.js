'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RcmProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RcmProduct.belongsTo(models.Product);
    }
  };
  RcmProduct.init({
    ProductId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RcmProduct',
  });
  return RcmProduct;
};