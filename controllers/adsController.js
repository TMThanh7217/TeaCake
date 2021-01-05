var controller = {};

var models = require('../models');
var Advertisements = models.Advertisement;

controller.createAds = function(ads){
	Advertisements.create(ads)
	.catch(function(error) {
		console.log(error)
	});
};

controller.getAllAds = () => {
	return new Promise ((resolve, reject) => {
        Advertisements
			.findAll()
			.then(ads => resolve(ads))
			.catch(error => reject(new Error(error))); 
    })
};

module.exports = controller;