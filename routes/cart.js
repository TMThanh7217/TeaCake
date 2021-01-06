var express = require("express");
var router = express.Router();
var orderController = require("../controllers/orderController");
var orderItemController = require("../controllers/orderItemController");

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
    res.json(cartItem);
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