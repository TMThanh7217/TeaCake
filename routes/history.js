var express = require('express');
var router = express.Router();
var myModules = require('../myModules/array')
var models = require('../models');
var orderController = require("../controllers/orderController");
var productController = require("../controllers/productController");
var orderItemController = require("../controllers/orderItemController");

router.get('/', (req, res) => { // cart page
    // ---- get user
    var acc = req.app.get('current_account');
    
    orderController.getOrdersByUserId(req.app.get('current_account'))
    .then(orders => {
        for (let i = 0; i < orders.length; i++) {
            orderItemController.getOrderItemsByOrderId(orders[i].id).then(orderItems => {
                orders[i].orderItems = orderItems;
            })
        }

        //console.log(orders);
        var page_data = {
            title: "TeaCake - History",
            orders: orders
        }
        res.render('history', page_data);
    })
    .catch(err => {
        res.send("Unknown err: " + err);
    })
})

module.exports = router;