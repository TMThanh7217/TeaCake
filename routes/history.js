var express = require('express');
var router = express.Router();
var myModules = require('../myModules/array')
var models = require('../models');
var orderController = require("../controllers/orderController");
var orderItemController = require("../controllers/orderItemController");

router.get('/', (req, res) => { // cart page
    // ---- get user
    
    var acc = req.app.get('current_account');
    
    orderController.getOrdersByUserId(acc)
    .then(orders => {

        var page_data = {
            title: "TeaCake - History",
            products: history_items
        }

        // ---- Render home page
        res.render('history', page_data);
    })
    .catch(err => {
        res.send("Unknown err: " + err);
    })
})

module.exports = router;