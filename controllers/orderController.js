var controller = {};

var models = require('../models');
var Orders = models.Order;
var OrderItems = models.OrderItem;
var Products = models.Pruduct;
var productController = require("../controllers/productController");

controller.createOrder = function(order){
	Orders.create(order)
	.catch(function(error) {
		console.log(error)
	});
};

controller.getOrders = () => {
	return new Promise ((resolve, reject) => {
        Orders
			.findAll()
			.then(order => resolve(order))
			.catch(error => reject(new Error(error))); 
    })
};

controller.getOrdersByUserId = id => {
    return new Promise((resolve, reject) => {
        Orders
            .findAll({
                where: {
                    UserId : id
                },
            })
            .then(orders => resolve(orders))
            .catch(error => reject(new Error(error))); 
    })
}

module.exports = controller;