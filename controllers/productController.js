var controller = {};

const sequelize = require('sequelize');
var models = require('../models');
var Products = models.Product;

controller.allProducts = callback => {
	Products.findAll({raw : true})
	.then(products => {
		callback(products);
	})
}

controller.findDrinks = callback => {
	
}

controller.searchProduct = function(keyword, callback){
	Products.findAll({
		where: {
			[sequelize.Op.or]: [
				{
					name: {
						[sequelize.Op.iLike]: '%' + keyword + '%'
					}
				},
				{
					description: {
						[sequelize.Op.iLike]: '%' + keyword + '%'
					}
				},
			]
		},
		raw: true
	}).then(function(products) {
		callback(products);
	});
};

module.exports = controller;