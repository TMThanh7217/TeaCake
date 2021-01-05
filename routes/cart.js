var express = require('express');
var router = express.Router();
var myModules = require('../myModules/array')
var models = require('../models');

router.get('/', (req, res) => { // cart page
    // ---- get user
    models.Product
    .findAll({
        raw : true,
    })
    .then(products => {
        
    
        let cart_items = myModules.getNElements(myModules.getCakes(products), 2).concat(myModules.getNElements(myModules.getTeas(products), 1)).concat(myModules.getNElements(myModules.getDrinks(products), 1));
        // ---- Prepare data for page
        var page_data = {
        title: "TeaCake - Cart",
        products: cart_items
        }

        // ---- Render home page
        res.render('cart', page_data);
    })
    .catch(err => {
        res.send("Unknown err: " + err);
    })
})

module.exports = router;