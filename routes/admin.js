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
var rcmProductController = require('../controllers/rcmProductController')
var OrderItems = models.OrderItem;

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

router.use('/statistic', require('../routes/statistic'));

// async function calTopBestSeller(typeee, num){
//     models.Product
//     .findAll({
//         where: { type: typeee },
//         include: [OrderItems]
//     })
//     .then(async function(products) {

//         let myPromise = new Promise(function(myResolve, myReject) {

//             for (let i = 0; i < products.length; i++) {
//                 var tmp = 0;
//                 if (products[i].OrderItems != null) {
//                     for (let j = 0; j < products[i].OrderItems.length; j++) {
//                         tmp += products[i].OrderItems[j].quantity;
//                     }
//                 }
//                 products[i].sold = tmp;
//             }

//             for (let i = 0; i < products.length; i++) {
//                 for (let j = 0 ; j < products.length - 1; j++) {
//                     if (i == j) continue;
//                     if (products[i].sold < products[j].sold) {
//                         var tmpProduct = products[i];
//                         products[i] = products[j];
//                         products[j] = tmpProduct;
//                     }
//                 }
//             }
//             products = products.slice(0, num);
//             console.log(products.length());
//             myResolve(products);
//         });
        
//         return await myPromise;
//     });
// }

// router.get('/change_rcm_product', (req, res) => {
//     models.Product
//     .findAll({raw : true})
//     .then(products => {
//         // get user

//         // ---- Prepare data for home page
//         var _cakes = array.getNElements(array.getCakes(products), 5); // get 5 recommend cakes
//         var _drinks = array.getNElements(array.getTeas(products), 3).concat(array.getNElements(array.getDrinks(products), 2)); // get recommend drinks (3 teas + 2 drinks)

        
//         let menu_cakes = calTopBestSeller("cake", 5);
//         let menu_drinks =  calTopBestSeller("drink", 3);
//         let menu_teas = calTopBestSeller("tea", 2);

//         console.log(menu_cakes);
//         console.log(menu_drinks);
//         console.log(menu_teas);
//         // menu_drinks = menu_drinks.concat(menu_teas);
//         var page_data = {
//             title: "TeaCake - Home",
//             rcm_cakes: _cakes,
//             rcm_drinks: _drinks,
//             menu_cakes: menu_cakes,
//             menu_drinks: menu_drinks
//         }
//         res.render('admin-change_rcm_product', page_data); 
//     })
// });

router.get('/change_rcm_product', (req, res) => {
    rcmProductController.getAll("cake").then(_cakes =>  {
        rcmProductController.getAll("drink").then(_drinks =>  {
            rcmProductController.getAll("tea").then(_teas =>  {
                models.Product.findAll({ where: { type: "cake" }, include: [OrderItems] }).then(cakes => {
                    models.Product.findAll({ where: { type: "drink" }, include: [OrderItems] }).then(drinks => {
                        models.Product.findAll({ where: { type: "tea" }, include: [OrderItems] }).then(teas => {

                            for (let i = 0; i < cakes.length; i++) {
                                var tmp = 0;
                                if (cakes[i].OrderItems != null) {
                                    for (let j = 0; j < cakes[i].OrderItems.length; j++) {
                                        tmp += cakes[i].OrderItems[j].quantity;
                                    }
                                }
                                cakes[i].sold = tmp;
                            }
                
                            for (let i = 0; i < cakes.length; i++) {
                                for (let j = 0 ; j < cakes.length - 1; j++) {
                                    if (i == j) continue;
                                    if (cakes[i].sold < cakes[j].sold) {
                                        var tmpcakes = cakes[i];
                                        cakes[i] = cakes[j];
                                        cakes[j] = tmpcakes;
                                    }
                                }
                            }

                            for (let i = 0; i < drinks.length; i++) {
                                var tmp = 0;
                                if (drinks[i].OrderItems != null) {
                                    for (let j = 0; j < drinks[i].OrderItems.length; j++) {
                                        tmp += drinks[i].OrderItems[j].quantity;
                                    }
                                }
                                drinks[i].sold = tmp;
                            }
                
                            for (let i = 0; i < drinks.length; i++) {
                                for (let j = 0 ; j < drinks.length - 1; j++) {
                                    if (i == j) continue;
                                    if (drinks[i].sold < drinks[j].sold) {
                                        var tmpdrinks = drinks[i];
                                        drinks[i] = drinks[j];
                                        drinks[j] = tmpdrinks;
                                    }
                                }
                            }

                            for (let i = 0; i < teas.length; i++) {
                                var tmp = 0;
                                if (teas[i].OrderItems != null) {
                                    for (let j = 0; j < teas[i].OrderItems.length; j++) {
                                        tmp += teas[i].OrderItems[j].quantity;
                                    }
                                }
                                teas[i].sold = tmp;
                            }
                
                            for (let i = 0; i < teas.length; i++) {
                                for (let j = 0 ; j < teas.length - 1; j++) {
                                    if (i == j) continue;
                                    if (teas[i].sold < teas[j].sold) {
                                        var tmpteas = teas[i];
                                        teas[i] = teas[j];
                                        teas[j] = tmpteas;
                                    }
                                }
                            }

                            cakes = cakes.slice(0, 5);
                            drinks = drinks.slice(0, 3);
                            teas = teas.slice(0, 2);

                            var page_data = {
                                title: "TeaCake - Home",
                                rcm_cakes: _cakes,
                                rcm_drinks: _drinks.concat(_teas),
                                menu_cakes: cakes,
                                menu_drinks: drinks.concat(teas)
                            }

                            res.render('admin-change_rcm_product', page_data); 
                        });
                    });
                });
            });
        });
    });
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

router.post('/get_rcm_product', function (req, res) {
    id1 = req.body.id1;
    id2 = req.body.id2;

    console.log(id1);
    console.log(id2);
    productController.getByID(id2).then(product2 => {
        rcmProductController.updateRcmProduct(id1, id2, product2.type);
        res.json(("ok"));
    });
});

module.exports = router;