var express = require('express');
var router = express.Router();
var myModules = require('../myModules/array')
var models = require('../models');
var OrderItems = models.OrderItem;

router.get('/', (req, res) => { // cart page
    // ---- get user
    models.Product
    .findAll({
        include: [OrderItems]
    })
    .then(products => {

        for (let i = 0; i < products.length; i++) {
            var tmp = 0;
            if (products[i].OrderItems != null) {
                for (let j = 0; j < products[i].OrderItems.length; j++) {
                    tmp += products[i].OrderItems[j].quantity;
                }
            }
            products[i].sold = tmp;
        }

        // ---- Prepare data for page
        var page_data = {
            title: "TeaCake - Statistic",
            products: products
        }

        // ---- Render home page
        res.render('statistic', page_data);
    })
    .catch(err => {
        res.send("Unknown err: " + err);
    })
})

module.exports = router;