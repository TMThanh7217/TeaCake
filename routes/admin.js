var express = require('express');
var router = express.Router();
var models = require('../models');
var array = require('../myModules/array');

router.get('/products', (req, res) => {
    models.Product
    .findAll({raw: true})
    .then(products => {
        // get user
        res.locals.user = req.app.get('current_user');

        // page data
        let page_data = {
            title: "TeaCake - Admin",
            products: products
        }

        // response
        res.render('admin-products', page_data);
    })
    .catch(err => {
        res.send("Error: " + err);
    })
})

module.exports = router;