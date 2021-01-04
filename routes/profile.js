var express = require('express');
var router = express.Router();
const controller = require('../controllers/userController');

router.get('/', (req, res) => { // credit page
  res.locals.user = req.app.get('current_user');
    // ---- get user
    controller.searchUser(req.app.get('current_account'), function(this_user) {
      // ---- Prepare data for page
      var page_data = {
        this_user: this_user,
        title: "TeaCake - Profile",
      }

      // ---- Render home page
      res.render('profile', page_data);
    });

});

router.post('/get_infor_user', (req, res) => {   
  res.locals.user = req.app.get('current_user');

  var birthday = req.body.birthday;
  birthday = birthday.split("/");

  var user = {
      id: req.app.get('current_account'),
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      pNum: req.body.phone,
      bDay: parseInt(birthday[0]),
      bMonth: parseInt(birthday[1]),
      bYear: parseInt(birthday[2]),
      gender: req.body.gender,
      nation: req.body.nation,
      bio: req.body.bio
  }

  controller.updateUser(user);
  res.redirect('/profile');
});

module.exports = router;