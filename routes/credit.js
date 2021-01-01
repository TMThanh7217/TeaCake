var express = require('express');
var router = express.Router();

router.get('/', (req, res) => { // credit page
    // ---- get user
    res.locals.user = req.app.get('current_user');
    // ---- Prepare data for page
    const path = require('path');
    const fs = require('fs');
    var members = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../public/json//members.json")));
    var page_data = {
      title : "TeaCake - Credit",
      members : members,
      pageCode : 4
    }

    // ---- Render home page
    res.render('credit', page_data);
});

module.exports = router;