var controller = {};

var models = require('../models');
var rcdProducts = models.RcmProduct;
var Products = models.Product;

controller.getAll = type => {
	return new Promise((resolve, reject) => {
		rcdProducts.findAll({
			where: { type: type },
			include: [Products]
		})
		.then(products => resolve(products))
		.catch(error => reject(new Error(error)))
	})
}

controller.updateRcmProduct = function(id1, id2, type){
	rcdProducts.update({
		ProductId: id2,
		type: type
	}, {
		where: { id: id1},
	});
};

module.exports = controller;