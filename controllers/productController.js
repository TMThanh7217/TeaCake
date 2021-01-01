var controller = {};

const sequelize = require('sequelize');
var models = require('../models');
var Product = models.Product;

controller.getAll = () => {
    return new Promise((resolve, reject) => {
        Product
            .findAll({raw : true})
            .then(products => resolve(products))
            .catch(error => reject(new Error(error))); 
    })
}

controller.getDrinks = () => {
    return new Promise((resolve, reject) => {
        Product
            .findAll({
                where: {
                    type : "drink"
                },
                raw : true
            })
            .then(products => resolve(products))
            .catch(error => reject(new Error(error))); 
    })
}

controller.getCakes = () => {
    return new Promise((resolve, reject) => {
        Product
            .findAll({
                where: {
                    type : "cake"
                },
                raw : true
            })
            .then(products => resolve(products))
            .catch(error => reject(new Error(error))); 
    })
}

controller.getTrendingProducts = limit => {
    return new Promise((resolve, reject) => {
        Product
            .findAll({
                order: [
                    ["like", "DESC"]
                ],
                limit: limit,
                raw : true
            })
            .then(products => resolve(products))
            .catch(error => reject(new Error(error))); 
    })
}

controller.getByID = id => {
    return new Promise((resolve, reject) => {
        Product
            .findOne({
                where: {
                    id : id
                },
                raw : true
            })
            .then(product => resolve(product))
            .catch(error => reject(new Error(error))); 
    })
}

controller.searchProduct = function(keyword, callback){
	Product.findAll({
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