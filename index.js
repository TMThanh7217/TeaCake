// ------Require out source modules here------
const express = require('express'); // express
const fs = require('fs'); // File stream
const { get } = require('http'); // HTTP protocol
const app = express(); // init app
const bodyParser = require("body-parser"); // For post method
const port = process.env.PORT || 8000; // Port
let exprHbs = require("express-handlebars"); // express handlebars
const { helpers } = require('handlebars');
const models = require('./models');
// -------- Some const var
const ANONYMOUS_USER = 0;
const COMMON_USER = 1;
const ADMIN_USER = 2;
const corsOptions = {
    origin: 'http://localhost:8000',
    optionsSuccessStatus: 200
}

// ------------------Some local vars----------------

app.set('userAuthorization', ANONYMOUS_USER); // identify user
// -------Use here------------------
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const cookieParser = require('cookie-parser');
app.use(cookieParser());

let session = require('express-session');
app.use(session({
  cookie: {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000},
  secret: "S3cret",
  resave: false,
  saveUninitialized: false
}));

var Cart = require('./controllers/cartController');
var notiController = require('./controllers/notiController');
app.use((req, res, next) => {
    res.locals.userAuthorization = req.app.get('userAuthorization');
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    req.session.cart = cart;
    res.locals.totalQuantity = cart.totalQuantity;
    
    
    if (req.app.get('current_account') != null) {
        notiController
            .getNotificationByID(req.app.get('current_account'))
            .then(noti => {
                res.locals.Notifications = noti;
            })
    }
    else {
        res.locals.Notifications = {};
    }
    next();
})

app.use(express.static(__dirname + "/public")); // Public files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// -------------doing stuff script here-------------
function _isAnonymous(user) { // return true if user is anonymous
    return user == ANONYMOUS_USER;
}

function _isCommon(user) { // return true if user is common user
    return user == COMMON_USER;
}

function _isAdmin(user) { // return true if user is admin
    return user == ADMIN_USER;
}

function _isHome(pageCode) {
    return pageCode == 0;
}

function _isMenu(pageCode) {
    return pageCode == 1;
}

function _isBlog(pageCode) {
    return pageCode == 2;
}

function _isContact(pageCode) {
    return pageCode == 3;
}

function _isCredit(pageCode) {
    return pageCode == 4;
}

function _isMenuCate(cate) {
    return cate.toLowerCase() == "menu";
}

function _isCakesCate(cate) {
    return cate.toLowerCase() == "cakes";
}

function _isDrinksCate(cate) {
    return cate.toLowerCase() == "drinks";
}

function _isTeasCate(cate) {
    return cate.toLowerCase() == "teas";
}


// ------Init some stuff
let hbs = exprHbs.create({
    extname : "hbs",
    defaultLayout : 'layout',
    layoutsDir : __dirname + '/views/layouts/',
    partialsDir : __dirname + '/views/partials/',
    runtimeOptions: {
        allowProtoPropertiesByDefault:true
    },
    helpers : {
        isAnonymous : _isAnonymous,
        isCommon : _isCommon,
        isAdmin : _isAdmin,
        isHome : _isHome,
        isBlog : _isBlog,
        isMenu : _isMenu,
        isContact : _isContact,
        isMenuCate : _isMenuCate,
        isDrinksCate : _isDrinksCate,
        isCakesCate : _isCakesCate,
        isTeasCate : _isTeasCate,
        isCredit : _isCredit,
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// ------------------Routing here-------------------
app.use('/', require('./routes/index')); // home page

app.use('/products', require('./routes/products')); // menu + product

app.use('/', require('./routes/login')); // login/register/logout

app.use('/credit', require('./routes/credit')); // Credit page

app.use('/cart', require('./routes/cart')); // cart 

app.use('/history', require('./routes/history')); // history pages

app.use('/statistic', require('./routes/statistic')); // history pages

app.use('/profile', require('./routes/profile')); // profile page

app.use('/contact', require('./routes/contact')); // contact page

app.use('/blog', require('./routes/blog')); // blogs page

app.use('/admin', require('./routes/admin')); // admin pages

//app.use('/notification', require('./routes/notification')); // view notification

// Sync to db
app.get('/sync', (req, res) => {
    models.sequelize.sync().then(()=>{
        res.send("TeaCakeDB sync successfully!!!");
    })
})

// listen log
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})