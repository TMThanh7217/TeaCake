var express = require('express');
var router = express.Router();
var models = require('../models')
var myModule = require('../myModules/array');
var adsController = require('../controllers/adsController')
var rcmProductController = require('../controllers/rcmProductController')

router.get('/', (req, res) => { // root-index page
    models.Product.findAll({raw : true}).then(products => {
        adsController.getAllAds().then(ads => {
            rcmProductController.getAll("cake").then(_cakes =>  {
                rcmProductController.getAll("drink").then(_drinks =>  {
                    rcmProductController.getAll("tea").then(_teas =>  {
                        // ---- Prepare data for home page
                        var today = new Date();
                        let unexpiredAds = []
                
                        for (let i = 0; i < ads.length; i++){
                            time = ads[i].end.split("/")
                            if (parseInt(time[0]) >= today.getFullYear()){
                                if (parseInt(time[1]) >= today.getMonth() + 1){
                                    if (parseInt(time[2]) >= today.getDate()) {
                                        unexpiredAds.push(ads[i])
                                    }
                                }
                            }
                        }

                        var page_data = {
                            title: "TeaCake - Home",
                            ads: unexpiredAds,
                            rec_cakes: _cakes,
                            rec_drinks: _drinks.concat(_teas),
                            pageCode : 0
                        }
                        // ---- Render home page
                        res.render('index', page_data);
                    });
                });
            });
        });                        
    })
    .catch(err => {
        res.send(err);
    })
})

module.exports = router;