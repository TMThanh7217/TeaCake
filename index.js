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
/*products = {
    cakes : [...],
    drinks : [...],
    teas : [...]
}*/
var products = JSON.parse(fs.readFileSync(__dirname + '/public/json/products.json')); // object of products

/*members = {
    "id": ...,
    "name": ...,
    "avt":"",
    "position": ...,
    "quote": ...
}
 */
var members = JSON.parse(fs.readFileSync(__dirname + "/public/json/members.json"));

/*UserInfor = {
    "fname": ...,
    "lname": ...,
    "account": ...,
    "password": ...,
    "avtImage": ...,
    "bgImage": ...,
    "email": ...,
    "pNumber": ...,
    "Bday": ...,
    "Bmonth": ...,
    "Byear": ...,
    "gender": ..., 
    "nation": ...,
    "bio": ...
}*/

/*
*/
var blogs = JSON.parse(fs.readFileSync(__dirname + "/public/json/blogs.json"));

app.set('current_user', ANONYMOUS_USER); // identify user
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


// ------Init some stuff
let hbs = exprHbs.create({
    extname : "hbs",
    defaultLayout : 'layout',
    layoutsDir : __dirname + '/views/layouts/',
    partialsDir : __dirname + '/views/partials/',
    helpers : {
        isAnonymous : _isAnonymous,
        isCommon : _isCommon,
        isAdmin : _isAdmin
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// ------------------Routing here-------------------
app.use('/', require('./routes/index')); // home page

app.use('/products', require('./routes/products')); // menu + product

app.use('/', require('./routes/login')); // login/register/logout

app.use('/add_ads', require('./routes/add_ads')); // Add_ads page

app.use('/credit', require('./routes/credit')); // Credit page

app.use('/cart', require('./routes/cart')); // cart 

app.use('/history', require('./routes/history')); // history pages

app.use('/profile', require('./routes/profile')); // profile page

app.use('/contact', require('./routes/contact')); // contact page

app.use('/blog', require('./routes/blog')); // blogs page

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