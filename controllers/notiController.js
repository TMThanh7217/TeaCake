var controller = {};
const models = require('../models');
const Notification = models.Notification;
const User = models.User;

controller.getNotificationByID = id => {
    return new Promise((resolve, reject) => {
        Notification
            .findAll({
                where: {
                    userID : id
                },
                include: [User]
            })
            .then(notifications => resolve(notifications))
            .catch(error => reject(new Error(error))); 
    })
}

controller.createNotification = function(notification) {
    return new Promise((resolve, reject) => {
        Notification
            .create(notification)
            .catch(error => reject(new Error(error))); 
    })
}

module.exports = controller;