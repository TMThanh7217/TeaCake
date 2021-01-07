var controller = {};

const { resolve } = require('path');
const sequelize = require('sequelize');
const models = require('../models');
const Product = models.Product;


controller.getAll = (sort) => {
    orderQuery = [];
    switch (sort) {
        case "1":
            orderQuery = [["name", "ASC"]];
            break;
        case "2":
            orderQuery = [["like", "DESC"]];
            break;
        case "4":
            orderQuery = [["updatedAt", "DESC"]];
            break;
        case "0":
            orderQuery = [["price", "ASC"]];
            break;
        default:
            orderQuery = [["name", "ASC"]];
            break;
    }
    return new Promise((resolve, reject) => {
        Product
            .findAll({
                raw : true,
                order: orderQuery
            })
            .then(products => resolve(products))
            .catch(error => reject(new Error(error))); 
    })
}

controller.getDrinks = (sort) => {
    orderQuery = [];
    switch (sort) {
        case "1":
            orderQuery = [["name", "ASC"]];
            break;
        case "2":
            orderQuery = [["like", "DESC"]];
            break;
        case "4":
            orderQuery = [["updatedAt", "DESC"]];
            break;
        case "0":
            orderQuery = [["price", "ASC"]];
            break;
        default:
            orderQuery = [["name", "ASC"]];
            break;
    }
    return new Promise((resolve, reject) => {
        Product
            .findAll({
                where: {
                    type : "drink"
                },
                raw : true,
                order: orderQuery
            })
            .then(products => resolve(products))
            .catch(error => reject(new Error(error))); 
    })
}

controller.getCakes = (sort) => {
    orderQuery = [];
    switch (sort) {
        case "1":
            orderQuery = [["name", "ASC"]];
            break;
        case "2":
            orderQuery = [["like", "DESC"]];
            break;
        case "4":
            orderQuery = [["updatedAt", "DESC"]];
            break;
        case "0":
            orderQuery = [["price", "ASC"]];
            break;
        default:
            orderQuery = [["name", "ASC"]];
            break;
    }
    return new Promise((resolve, reject) => {
        Product
            .findAll({
                where: {
                    type : "cake"
                },
                
                raw : true,
                order: orderQuery
            })
            .then(products => resolve(products))
            .catch(error => reject(new Error(error))); 
    })
}

controller.getTeas = (sort) => {
    orderQuery = [];
    switch (sort) {
        case "1":
            orderQuery = [["name", "ASC"]];
            break;
        case "2":
            orderQuery = [["like", "DESC"]];
            break;
        case "4":
            orderQuery = [["updatedAt", "DESC"]];
            break;
        case "0":
            orderQuery = [["price", "ASC"]];
            break;
        default:
            orderQuery = [["name", "ASC"]];
            break;
    }
    return new Promise((resolve, reject) => {
        Product
            .findAll({
                where: {
                    type : "tea"
                },
                raw : true,
                order: orderQuery
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

controller.searchProduct = function(keyword){
	return new Promise ((resolve, reject) => {
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
        })
        .then(products => {
            resolve(products);
        })
        .catch(err => {
            resolve(err);
        });
    })
};

controller.createProduct = function(product){
	Product.create(product)
	.catch(function(error) {
		console.log(error)
	});
};

module.exports = controller;