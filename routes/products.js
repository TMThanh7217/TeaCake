var express = require('express');
var router = express.Router();
var models = require('../models');
const productController = require('../controllers/productController');
const commentController = require('../controllers/commentController');
function _getRows(data, cap) { // 1D array to 2D array and 2nd dim have size = cap 
    let rows = []; // init 2D array
    for(let i = 0; i < data.length; i += cap) {
        let row_data = data.slice(i, i + cap); // get cap elements of data 
        rows.push(row_data);
    }
    
    return rows;
}

router.get('/', (req, res) => { // menu page
   
    
    productController
    .getAll()
    .then(products => {
        // ---- get rows with each row have 3 products
        var rows_data = _getRows(products, 3);
        
        // ---- Prepare data for page
        var page_data = {
            title: "TeaCake - Menu",
            rows: rows_data,
            pageCode : 1,
            
            cate : "Menu"
        }

        // ---- Render home page
        res.render('menu', page_data);
    })
    .catch(err => {
        res.send("Something went wrong!! " + err);
    })
})

router.get('/cakes', (req, res) => {
   

    productController
    .getCakes()
    .then(products => {
        var rows = _getRows(products, 3);
        
        var page_data = {
            title : "TeaCake - Cakes",
            pageCode : 1,
            rows : rows,
            cate : "Cakes"
        }
        
        res.render("menu", page_data);
    })
    .catch(err => {
        res.send("Error: " + err);
    })
})

router.get('/teas', (req, res) => {
   

    productController
    .getTeas()
    .then(products => {
        var rows = _getRows(products, 3);
        
        var page_data = {
            title : "TeaCake - Teas",
            pageCode : 1,
            rows : rows,
            cate : "Teas"
        }
        
        res.render("menu", page_data);
    })
    .catch(err => {
        res.send("Error: " + err);
    })
})

router.get('/drinks', (req, res) => {
   

    productController
    .getDrinks()
    .then(products => {
        var rows = _getRows(products, 3);
        
        var page_data = {
            title : "TeaCake - Drinks",
            pageCode : 1,
            rows : rows,
            cate : "Drinks"
        }
        
        res.render("menu", page_data);
    })
    .catch(err => {
        res.send("Error: " + err);
    })
})

router.get('/search', (req, res) => { 
   

    var keyword = req.query.keyword;
    productController
        .searchProduct(keyword)
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
            if (products.length != 0)
                res.render('menu', page_data);
            else
                res.render('PNF', page_data)
        })
        .catch(err => res.send("Error: " + err));
})


router.get('/:id', (req, res) => { // product pages
   

    models.Product
    .findByPk(Number(req.params.id), {raw : true})
    .then(product => {
        commentController
            .getCommentByID(req.params.id)
            .then(comments => {
                var chartStars = [0, 0, 0, 0, 0];
                var totalRate = 0;
                var totalStar = 0;
                var is_login = true; 
                
                for (let i of comments) {
                    chartStars[i.star - 1] +=1;
                    totalRate +=1;
                    totalStar += i.star;
                }

                for (let i = 0; i < 5; i++){
                    chartStars[i] = (chartStars[i]/totalRate)*100;
                }

                if(req.app.get('current_user') == 0){
                    is_login = false;
                }
                
                if (is_login){
                    
                }

                // ---- Prepare data for page
                var page_data = {
                    chartStars: chartStars,
                    total: totalRate*5,
                    totalStar: totalStar,
                    title: `TeaCake - ${product.name}`,
                    product: product,
                    size: comments.length,
                    comments: comments,
                    is_login: is_login,
                    pageCode : 1
                }

                // ---- Render home page
                res.render('product', page_data);
            })
            .catch(err => res.send("Error: " + err));
    })
    .catch(err => {
        res.json(err);
    })
})

router.post('/get_comment', (req, res) => { 
   

    var today = new Date();
    var dateTime = today.getHours() + ':' + today.getMinutes() + ' ' + today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    var comment = {
        ProductId: req.body.ProductId,
        UserId: req.app.get('current_account'),
        star: req.body.rate,
        content: req.body.content,
        time: dateTime,
    }
    console.log(comment);
    commentController.createComment(comment);

    console.log('done')
    res.redirect(`/products/${req.body.ProductId}`)
})


module.exports = router;