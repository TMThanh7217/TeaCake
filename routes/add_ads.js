var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.locals.user = req.app.get('current_user');
    res.render('add_ads');
});

module.exports = router;