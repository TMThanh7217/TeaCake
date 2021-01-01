var express = require('express');
var router = express.Router();
var myModules = require('../myModules/array')
var path = require('path');
var fs = require('fs');
var blogs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/json/blogs.json')));

router.get('/', (req, res) => { // credit page
    // ---- get user
    res.locals.user = req.app.get('current_user');

    var rows = myModules.getRows(blogs, 3);
    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - Blog",
      rows: rows,
      pageCode: 2
    }

    // ---- Render home page
    res.render('blog', page_data);
});

module.exports = router;