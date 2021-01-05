var express = require('express');
var router = express.Router();
var models = require('../models');
var array = require('../myModules/array');

router.get('/products', (req, res) => {
    models.Product
    .findAll({raw: true})
    .then(products => {
        // get user
        

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

router.get('/products/add', (req, res) => {
    res.locals.user = req.app.get('current user');
    let page_data = {
        title: "TeaCake - Admin"
    }
    res.render('admin-add', page_data);
})

router.get('/add_ads', (req, res) => {
    
    let page_data = {
        title: "TeaCake - Admin"
    }
    res.render('admin-add-ads', page_data);
});

function _getRows(data, cap) { // 1D array to 2D array and 2nd dim have size = cap 
    let rows = []; // init 2D array
    for(let i = 0; i < data.length; i += cap) {
        let row_data = data.slice(i, i + cap); // get cap elements of data 
        rows.push(row_data);
    }
    
    return rows;
}


router.get('/change_rcm_product', (req, res) => {
    models.Product
    .findAll({raw : true})
    .then(products => {
        // get user
        

        // ---- get rows with each row have 3 products
        var rows_data = _getRows(products, 5);

        // ---- Prepare data for home page
        let _cakes = array.getNElements(array.getCakes(products), 5); // get 5 recommend cakes
        let _drinks = array.getNElements(array.getTeas(products), 3).concat(array.getNElements(array.getDrinks(products), 2)); // get recommend drinks (3 teas + 2 drinks)

        // ---Khi co thong ke, se doi 2 cai nay thanh 5-5 san pham duoc ua thich nhat
        var menu_cakes = _cakes;
        var menu_drinks = _drinks;

        var page_data = {
            title: "TeaCake - Home",
            rcm_cakes: _cakes,
            rcm_drinks: _drinks,
            menu_cakes: menu_cakes,
            menu_drinks: menu_drinks
        }
        res.render('admin-change_rcm_product', page_data);
    })
});



module.exports = router;