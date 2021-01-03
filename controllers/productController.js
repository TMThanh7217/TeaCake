var controller = {};

const { resolve } = require('path');
const sequelize = require('sequelize');
const models = require('../models');
const Product = models.Product;
const Comment = models.Comment;
const User = models.User;

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

controller.getCommentbyID = id => {
    return new Promise((resolve, reject) => {
        Comment
            .findAll({
                where: {
                    ProductId : id
                },
                include: [User]
            })
            .then(comments => resolve(comments))
            .catch(error => reject(new Error(error))); 
    })
}

controller.createComment = function(comment){
    return new Promise((resolve, reject) => {
        Comment
            .create(comment)
            .catch(error => reject(new Error(error))); 
    })
}

module.exports = controller;