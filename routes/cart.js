var express = require("express");
var router = express.Router();

router.get('/', (req, res) => {
    var cart = req.session.cart;
    res.locals.cart = cart.getCart();
    res.render('cart');
});


router.post('/', (req, res, next) => {
    var productID = Number(req.body.id);
    var quantity = isNaN(req.body.quantity) ? 1 : Number(req.body.quantity);
    var productController = require("../controllers/productController");
    productController
        .getByID(productID)
        .then(product => {
            product.price = Number(product.price);
            var cartItem = req.session.cart.add(product, productID, quantity);
            res.json(cartItem);
        })
        .catch(err => next(err));
});

router.post('/remove', (req, res, next) => {
    var productID = Number(req.body.id);
    var cart = req.session.cart;
    var cartItem = cart.remove(productID);
    console.log("_______________")
    console.log(cartItem.totalPrice)
    res.json(cartItem);
});

module.exports = router;