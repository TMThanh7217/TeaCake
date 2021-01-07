var express = require("express");
var router = express.Router();
var orderController = require("../controllers/orderController");
var orderItemController = require("../controllers/orderItemController");
var notiController = require('../controllers/notiController');

router.get('/', (req, res) => {
    var cart = req.session.cart;
    res.locals.cart = cart.getCart();
    var pageData = {
        title: "TeaCake - Cart",
        isEmpty: cart.isEmpty()
    }
    res.render('cart', pageData);
});


router.post('/', (req, res, next) => {
    var productID = Number(req.body.id);
    var quantity = isNaN(req.body.quantity) ? 1 : Number(req.body.quantity);
    var productController = require("../controllers/productController");
    productController
        .getByID(productID)
        .then(product => {
            product.price = Number(product.price);
            var cart = req.session.cart;
            var cartData = cart.add(product, productID, quantity);
            res.json(cartData);
        })
        .catch(err => next(err));
});

router.post('/remove', (req, res, next) => {
    var productID = Number(req.body.id);
    var cart = req.session.cart;
    var cartData = cart.remove(productID);
    res.json(cartData);
});


router.post('/empty', (req, res, next) => {
    var cart = req.session.cart;
    cart.empty();
    res.json("OK");
});

router.post('/pay', (req, res, next) => {
    var cart = req.session.cart;
    var acc = req.app.get('current_account');
    // total, discount, total_after
    var total = req.body.total;
    var discount = req.body.discount;
    var final_price = req.body.total_after;


    orderController.getOrders().then(orders => {
        var newId = orders.length;
        var order = {
            "id": newId,
            "UserId": acc,
            "totalPrice": total.replace("$", ""),
            "discount": discount,
            "finalPrice": final_price.replace("$", ""),
            "paymentMethod": "COD"
        }
        orderController.createOrder(order);

        var noti = {
            author: "TeaCake",
            UserId: acc,
            header: "Order successfully",
            content: "You've ordered successfully, check out in your history!",
            img: "/images/TeaCake.png"
        }
        notiController.createNotification(noti);

        for (let i = 0; i < cart.getCart().items.length; i++) {
            var orderItem = {
                "OrderId": newId,
                "ProductId": cart.getCart().items[i].item.id,
                "quantity": cart.getCart().items[i].quantity
            }
            orderItemController.createOrderItem(orderItem);
        }
    })
});

module.exports = router;