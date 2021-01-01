var express = require('express');
var router = express.Router();
var models = require('../models');
const controller = require('../controllers/productController');

function _getRows(data, cap) { // 1D array to 2D array and 2nd dim have size = cap 
    let rows = []; // init 2D array
    for(let i = 0; i < data.length; i += cap) {
        let row_data = data.slice(i, i + cap); // get cap elements of data 
        rows.push(row_data);
    }
    
    return rows;
}

router.get('/', (req, res) => { // menu page
    res.locals.user = req.app.get('current_user');
    models.Product
    .findAll({
        raw : true
    })
    .then(products => {
        // ---- get rows with each row have 3 products
        var rows_data = _getRows(products, 3);
        
        // ---- Prepare data for page
        var page_data = {
        title: "TeaCake - Menu",
        rows: rows_data,
        pageCode : 1
        }

        // ---- Render home page
        res.render('menu', page_data);
    })
    .catch(err => {
        res.send("Something went wrong!! " + err);
    })
})

router.get('/search', (req, res) => {
    res.locals.user = req.app.get('current_user');

    var keyword = req.query.keyword;
    controller.searchProduct(keyword, function(products) {

        // ---- get rows with each row have 3 products
        var rows_data = _getRows(products, 3);

        // ---- Prepare data for page
        var page_data = {
            title: "TeaCake - Menu",
            rows: rows_data,
            pageCode : 1
        }

        // ---- Render home page
        if (products.length != 0)
            res.render('menu', page_data);
        else
            res.render('PNF', page_data)
    });
})

router.get('/:id', (req, res) => { // product pages
    res.locals.user = req.app.get('current_user');
    models.Product
    .findByPk(Number(req.params.id), {raw : true})
    .then(product => {
       
        // ---- Prepare data for page
        // ---- get user

        var page_data = {
            title: `TeaCake - ${product.name}`,
            product: product,
            pageCode : 1
        }

        // ---- Render home page
        res.render('product', page_data);
    })
    .catch(err => {
        res.json(err);
    })
})


module.exports = router;