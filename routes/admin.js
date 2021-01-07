var express = require('express');
var router = express.Router();
var models = require('../models');
var array = require('../myModules/array');
var adsController = require('../controllers/adsController')
var productController = require('../controllers/productController')
const AWS = require('aws-sdk');
const Busboy = require('busboy');
const controller = require('../controllers/adsController');
var notiController = require('../controllers/notiController');
var userController = require('../controllers/userController');

router.get('/products', (req, res) => {
    if (res.locals.userAuthorization != 2)
    return res.render('error', {
        title: "Authorization Error",
        errMess: "You don't have permission to access this page!",
        errTitle: "ACCESS DENIED"
    })
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
    if (res.locals.userAuthorization != 2)
    return res.render('error', {
        title: "Authorization Error",
        errMess: "You don't have permission to access this page!",
        errTitle: "ACCESS DENIED"
    })
    res.locals.user = req.app.get('current user');
    let page_data = {
        title: "TeaCake - Admin"
    }
    res.render('admin-add', page_data);
})

router.get('/add_ads', (req, res) => {
    if (res.locals.userAuthorization != 2)
    return res.render('error', {
        title: "Authorization Error",
        errMess: "You don't have permission to access this page!",
        errTitle: "ACCESS DENIED"
    })
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

router.post('/get_product', (req, res) => {
    var s3bucket = new AWS.S3({
        accessKeyId: 'AKIATRGWWZO2WUH5TFNJ',
        secretAccessKey: '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',
        Bucket: 'mind-sharing'
    });
    var busboy = new Busboy({ headers: req.headers });
    var product = {}

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        if (filename != ''){
            s3bucket.createBucket(function () {
                var params = {
                    Bucket: 'mind-sharing',
                    Key: 'product_' + product['name'].replace(" ", "_") + '.jpg',
                    Body: file
                };
                s3bucket.upload(params, function (err, data) {
                    if (err) {
                        console.log('error in callback');
                        console.log(err);
                    }
                    console.log('success');
                    console.log(data);
                });
            });    

            file.on('data', function(data) {});
            file.on('end', function() {});

            product['src'] = 'https://mind-sharing.s3-ap-southeast-1.amazonaws.com/' + 'product_' + product['name'].replace(" ", "_") + '.jpg'
        }
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        product[fieldname] = val;
    });

    busboy.on('finish', function() {
        product['like'] = 0,
        productController
            .getAllProducts()
            .then(products => { 
                product['id'] = products[products.length - 1].id + 1,
                console.log(product)
                productController.createProduct(product);

                userController
                .getAllUsers()
                .then(users => {
                    for (let i = 0; i < users.length; i++) {
                        var noti = {
                            author: "TeaCake",
                            UserId: users[i].id,
                            header: "New Product",
                            content: "We've just released a new product! Check it out in Menu!",
                            img: "/images/TeaCake.png"
                        }
                        notiController.createNotification(noti);
                    }
                })

                res.redirect('products/add');
            });
    });

    req.pipe(busboy);
});

router.post('/get_ads', function (req, res) {
    var s3bucket = new AWS.S3({
        accessKeyId: 'AKIATRGWWZO2WUH5TFNJ',
        secretAccessKey: '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',
        Bucket: 'mind-sharing'
    });
    var busboy = new Busboy({ headers: req.headers });
    var ads = {}

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        if (filename != ''){
            s3bucket.createBucket(function () {
                var params = {
                    Bucket: 'mind-sharing',
                    Key: 'ads_' + ads.pos + '.png',
                    Body: file
                };
                s3bucket.upload(params, function (err, data) {
                    if (err) {
                        console.log('error in callback');
                        console.log(err);
                    }
                    console.log('success');
                    console.log(data);
                });
            });    

            file.on('data', function(data) {});
            file.on('end', function() {});
            
            ads['img'] = 'ads_' + ads.pos + '.png'
        }
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        ads[fieldname] = val;
    });

    busboy.on('finish', function() {
        console.log(ads);
        ads['start'] = ads['yStart'] +  '/' + ads['mStart'] + '/' + ads['dStart'];
        ads['end'] = ads['yEnd'] +  '/' + ads['mEnd'] + '/' + ads['dEnd'];
        adsController.createAds(ads);

        res.redirect('/');
    });

    req.pipe(busboy);
});

module.exports = router;