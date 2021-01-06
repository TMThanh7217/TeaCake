var controller = {};

var models = require('../models');
var OrderItems = models.OrderItem;

controller.createOrderItem = function(orderItem){
	OrderItems.create(orderItem)
	.catch(function(error) {
		console.log(error)
	});
};

controller.getOrderItems = () => {
	return new Promise ((resolve, reject) => {
        OrderItems
			.findAll()
			.then(orderItem => resolve(orderItem))
			.catch(error => reject(new Error(error))); 
    })
};

module.exports = controller;