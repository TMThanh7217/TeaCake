var controller = {};

var models = require('../models');
var User = models.User;

controller.searchUser = function(account, callback){
	User.findOne({
		where: { id: account },
		raw: true
	}).then(function(this_user) {
		callback(this_user);
	});
};

controller.createUser = function(user){
	models.User
	.create(user)
	.catch(function(error) {
		console.log(error)
	});
};

controller.updateUser = function(user){
	models.User
	.update({
		type: 'USER',
	}, {
		where: {id: user.account},
	}
	);
};

module.exports = controller;