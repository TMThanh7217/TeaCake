var express = require('express');
var router = express.Router();
const controller = require('../controllers/userController');

router.get('/', (req, res) => { // credit page
    // ---- get user
    console.log(req.app.get('current_account'));
    controller.searchUser(req.app.get('current_account'), function(this_user) {
      // ---- Prepare data for page
      var page_data = {
        user: this_user,
        title: "TeaCake - Profile",
      }

      // ---- Render home page
      res.render('profile', page_data);
    });

});

module.exports = router;