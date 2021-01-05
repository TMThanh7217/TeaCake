var controller = {};
const models = require('../models');
const Comment = models.Comment;
const User = models.User;

controller.getCommentByID = id => {
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

controller.createComment = function(comment) {
    return new Promise((resolve, reject) => {
        Comment
            .create(comment)
            .catch(error => reject(new Error(error))); 
    })
}

module.exports = controller;