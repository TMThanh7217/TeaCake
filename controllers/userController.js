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
		fname: user.fname,
		lname: user.lname,
		email: user.email,
		pNum: user.pNum,
		bDay: user.bDay,
		bMonth: user.bMonth,
		bYear: user.bYear,
		gender: user.gender,
		nation: user.nation,
		bio: user.bio
	}, {
		where: {id: user.id},
	}
	);
};

module.exports = controller;