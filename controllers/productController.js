var controller = {};

const { resolve } = require('path');
const sequelize = require('sequelize');
const models = require('../models');
const Product = models.Product;


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

controller.getTeas = () => {
    return new Promise((resolve, reject) => {
        Product
            .findAll({
                where: {
                    type : "tea"
                },
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

module.exports = controller;