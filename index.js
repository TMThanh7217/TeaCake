// ------Require out source modules here------
const express = require('express'); // express
const fs = require('fs'); // File stream
const { get } = require('http'); // HTTP protocol
const app = express(); // init app
const bodyParser = require("body-parser"); // For post method
const port = process.env.PORT || 8000; // Port
let exprHbs = require("express-handlebars"); // express handlebars
const { helpers } = require('handlebars');
const cors = require('cors');
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

var current_user = ANONYMOUS_USER; // identify user


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
function _getRows(data, cap) { // 1D array to 2D array and 2nd dim have size = cap 
    let rows = []; // init 2D array
    for(let i = 0; i < data.length; i += cap) {
        let row_data = data.slice(i, i + cap); // get cap elements of data 
        rows.push(row_data);
    }
    
    return rows;
}

function _getAllProducts(pds) { // convert products object to array
    /*products = pds = {
    cakes : [...],
    drinks : [...],
    teas : [...]
    }*/
    return pds.teas.concat(pds.cakes).concat(pds.drinks);
}

function _getNElements(data, n) { // get n first element of data array
    return data.slice(0, n);
}

function _isAnonymous(user) { // return true if user is anonymous
    return user == ANONYMOUS_USER;
}

function _isCommon(user) { // return true if user is common user
    return user == COMMON_USER;
}

function _isAdmin(user) { // return true if user isd admin
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

app.use((req, res, next) => { // use local variable for handlebars dynamic pages
    res.locals.user = current_user;
    next();
 });

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// ------------------Routing here-------------------
app.get('/', (req, res) => { // root-index page
    // ---- get user
    res.locals.user = current_user;

    // ---- Prepare data for home page
    let _cakes = _getNElements(products.cakes, 5); // get 5 recommend cakes
    let _drinks = _getNElements(products.teas, 3).concat(_getNElements(products.drinks, 2)); // get recommend drinks (3 teas + 2 drinks)
    var page_data = {
      title: "TeaCake - Home",
      rec_cakes: _cakes,
      rec_drinks: _drinks,
    }

    // ---- Render home page
    res.render('index', page_data);
})

app.get('/login', (req, res) => { // login page
    current_user = COMMON_USER;
    res.locals.user = current_user;
    res.render('login_register');
})

app.get('/logout', (req, res) => { // logout page
    // ---- Change user to anonymous
    current_user = ANONYMOUS_USER;
    
     // ---- get user
     res.locals.user = current_user;

    // ---- Prepare data for home page
    let _cakes = _getNElements(products.cakes, 5); // get 5 recommend cakes
    let _drinks = _getNElements(products.teas, 3).concat(_getNElements(products.drinks, 2)); // get recommend drinks (3 teas + 2 drinks)
    var page_data = {
      title: "TeaCake - Home",
      rec_cakes: _cakes,
      rec_drinks: _drinks,
    }

    // ---- Render home page
    res.render('index', page_data);
})

app.get('/menu', (req, res) => { // menu page
    // ---- get user
    res.locals.user = current_user;

    // ---- get rows with each row have 3 products
    var rows_data = _getRows(_getAllProducts(products), 3);
    
    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - Menu",
      rows: rows_data
    }

    // ---- Render home page
    res.render('menu', page_data);
})

app.get('/product', (req, res) => { // product page
    
    // ---- get user
    res.locals.user = current_user;

    // ---- get rows with each row have 3 products
    var all_product = _getAllProducts(products);
    var product = all_product.find(elem => elem.id.toString() == req.query.id);
    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - Product #" + (Number(req.query.id) + 1),
      product: product
    }

    // ---- Render home page
    res.render('product', page_data);
})


// listen log
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

