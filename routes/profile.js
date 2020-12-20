var express = require('express');
var router = express.Router();

router.get('/', (req, res) => { // credit page
    // ---- get user
    res.locals.user = req.app.get('current_user');

    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - Profile",
    }

    // ---- Render home page
    res.render('profile', page_data);
});

module.exports = router;