const controller = require('../controllers/productController');
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    

    var keyword = req.query.keyword;
    controller.searchProduct(keyword, function(product) {
        
    });
})

module.exports = router;