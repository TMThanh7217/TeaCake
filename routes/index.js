var express = require('express');
var router = express.Router();
var models = require('../models')
var myModule = require('../myModules/array');

router.get('/', (req, res) => { // root-index page
    models.Product
    .findAll({raw : true})
    .then(products => {
        // ---- get user
        res.locals.user = req.app.get('current_user');

        // ---- Prepare data for home page
        let _cakes = myModule.getNElements(myModule.getCakes(products), 5); // get 5 recommend cakes
        let _drinks = myModule.getNElements(myModule.getTeas(products), 3).concat(myModule.getNElements(myModule.getDrinks(products), 2)); // get recommend drinks (3 teas + 2 drinks)
        var page_data = {
            title: "TeaCake - Home",
            rec_cakes: _cakes,
            rec_drinks: _drinks,
        }
        // ---- Render home page
        res.render('index', page_data);
    })
    .catch(err => {
        res.send(err);
    })
})

module.exports = router;