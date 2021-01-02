var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs'); // File stream
const bcrypt = require('bcrypt');
const controller = require('../controllers/userController');
const ANONYMOUS_USER = 0;
const COMMON_USER = 1;
const ADMIN_USER = 2;

router.get('/login', (req, res) => { // login page
    res.locals.user = req.app.get('current_user');
    
    res.render('login_register');
})

router.post('/get_infor_register', (req, res) => {

    if (req.body.resAcc.includes(" ")){
        res.render('login_register', {resAnnoun: '*Account cannot contain space', func: "register()"});
    }
    else {
        controller.searchUser(req.body.resAcc, function(this_user) {
            if (this_user != null){
                res.render('login_register',{resAnnoun: '*Account ' + req.body.account + ' has already exists', func: "register()"});
            }
            else {
                var salt = bcrypt.genSaltSync(10);

                var userAcc = {
                    id: req.body.resAcc,
                    password: bcrypt.hashSync(req.body.password, salt),
                    type: "USER",
                    fname: req.body.fname,
                    lname: req.body.lname,
                    avt: 'default',
                    bg: 'default',
                    email: "",
                    pNum: "",
                    bDay: req.body.bDay,
                    bMonth: req.body.bMonth,
                    bYear: req.body.bYear,
                    gender: req.body.gender,
                    nation: "",
                    bio: ""
                }
    
                req.app.set('current_user', COMMON_USER);
                req.app.set('current_account', req.body.resAcc)

                controller.createUser(userAcc);
                res.redirect("/");
            }
        });
    }
});

router.post('/get_infor_login', (req, res) => {

    controller.searchUser(req.body.logAcc, function(this_user) {
        if (this_user != null){
            if (bcrypt.compareSync(req.body.logPass, this_user.password)){
                if (this_user.type == "ADMIN"){
                    req.app.set('current_user', ADMIN_USER);  
                }
                else {
                    req.app.set('current_user', COMMON_USER);
                }
                
                req.app.set('current_account', req.body.logAcc)
                res.redirect("/");
            }
            else {
                res.render('login_register', {logAnnoun: '*Invalid username or password'});
            }
        }
        else {
            res.render('login_register', {logAnnoun: '*Invalid username or password'});
        }
    });
});


router.get('/logout', (req, res) => { // logout page
    // ---- Change user to anonymous
    req.app.set('current_user', ANONYMOUS_USER);
    res.locals.user = req.app.get('current_user');
    res.redirect('/');
})

module.exports = router;
