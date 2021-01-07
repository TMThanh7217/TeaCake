var controller = {};
const models = require('../models');
const Notification = models.Notification;
const User = models.User;

controller.getNotificationByID = id => {
    return new Promise((resolve, reject) => {
        Notification
            .findAll({
                where: {
                    UserId : id
                }
            })
            .then(notifications => resolve(notifications))
            .catch(error => reject(new Error(error))); 
    })
}

controller.createNotification = function(notification) {
        Notification
        .create(notification)
        .catch(function(error) {
            console.log(error)
        });
}

module.exports = controller;