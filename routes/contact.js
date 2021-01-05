var express = require('express');
var router = express.Router();

router.get('/', (req, res) => { // credit page
    // ---- get user
    

    // ---- Prepare data for page
    var page_data = {
        title: "TeaCake - Contact",
        pageCode : 3
    }

    // ---- Render home page
    res.render('contact', page_data);
});

module.exports = router;