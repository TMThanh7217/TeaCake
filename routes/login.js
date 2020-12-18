var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs'); // File stream
var bcrypt = require('bcrypt');
var accountFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../public/json/account.json")));
const ANONYMOUS_USER = 0;
const COMMON_USER = 1;
const ADMIN_USER = 2;

router.get('/login', (req, res) => { // login page
    res.locals.user = req.app.get('current_user');
    res.render('login_register');
})

function checkExist(ArrAcc, newAcc){

    var check = false;
    ArrAcc.forEach(ele => {
        if (String(ele.account) === String(newAcc))
            check = true;
        }
    )
    return check;
}

router.post('/get_infor_register', (req, res) => {
    res.locals.user = req.app.get('current_user');
    if (req.body.account.includes(" ")){
        res.render('login_register', {resAnnoun: '*Account cannot contain space', func: "register()"});
    }
    else {
        if (checkExist(accountFile.userInfor, req.body.account) == false){
            var user = {};
            user.fname = req.body.fname;
            user.lname = req.body.lname;
            user.account = req.body.account;
            user.password = req.body.password;
            user.avtImage = "";
            user.bgImage = "";
            user.email = "";
            user.pNumber = "";
            user.Bday = req.body.Bday;
            user.Bmonth = req.body.Bmonth;
            user.Byear = req.body.Byear;
            user.gender = req.body.gender;
            user.nation = "";
            user.bio = "";
            
            var salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);

            accountFile.userInfor.push(user);
            fs.writeFileSync(path.resolve(__dirname, "../public/json/account.json", JSON.stringify(accountFile)));
            req.app.set('current_user', ADMIN_USER);
            res.locals.user = req.app.get('current_user');
            res.redirect("/");
        }
        else {
            res.render('login_register', {resAnnoun: '*Account ' + req.body.account + ' has already exists', func: "register()"});
        }
    }
});

function checkLogin(ArrAcc, Acc, Pass){
    var check = false;
    
    ArrAcc.forEach(ele => {
        if (String(ele.account) == String(Acc))
            if (bcrypt.compareSync(Pass, ele.password))
                check = true;
    })

    return check;
}

router.post('/get_infor_login', (req, res) => {
    res.locals.user = req.app.get('current_user');
    if (checkLogin(accountFile.userInfor, req.body.logAcc, req.body.logPass)){
        req.app.set('current_user', ADMIN_USER)
        res.locals.user = req.app.get('current_user');
        res.redirect("/");
    }
    else{
        res.render('login_register', {logAnnoun: 'Invalid Username or Password'});
    }

});

router.get('/logout', (req, res) => { // logout page
    // ---- Change user to anonymous
    req.app.set('current_user', ANONYMOUS_USER);
    res.locals.user = req.app.get('current_user');
    res.redirect('/');
})

module.exports = router;