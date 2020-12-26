var controller = {};

var models = require('../models');
var Users = models.User;

controller.searchUser = function(account, callback){
	Users.findOne({
		where: { id: account },
		raw: true
	}).then(function(this_user) {
		callback(this_user);
	});
};

controller.createUser = function(user){
	Users.create(user)
	.catch(function(error) {
		console.log(error)
	});
};

controller.updateUser = function(user){
	Users.update({
		type: 'USER',
	}, {
		where: {id: user.account},
	}
	);
};

module.exports = controller;