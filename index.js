// ------Require out source modules here------
const express = require('express'); // express
const fs = require('fs'); // File stream
const { get } = require('http'); // HTTP protocol
const app = express(); // init app
const bodyParser = require("body-parser"); // For post method
const port = process.env.PORT || 8000; // Port
let exprHbs = require("express-handlebars"); // express handlebars
const { helpers } = require('handlebars');

// -------- Some const var
const ANONYMOUS_USER = 0;
const COMMON_USER = 1;
const ADMIN_USER = 2;

// ---------- Some var
var current_user = ANONYMOUS_USER; // identify user


// -------Use here------------------
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


// ------------------Some local vars----------------
/*products = {
    cakes : [...],
    drinks : [...],
    teas : [...]
}*/
var products = JSON.parse(fs.readFileSync(__dirname + '/public/json/products.json')); // object of products

// ------------------Routing here-------------------
app.get('/', (req, res) => { // root-index page
    res.locals.user = current_user;
    let _cakes = _getNElements(products.cakes, 5); // get 5 recommend cakes
    let _drinks = _getNElements(products.teas, 3).concat(_getNElements(products.drinks, 2)); // get recommend drinks (3 teas + 2 drinks)
    var page_data = {
      title: "TeaCake - Home",
      rec_cakes: _cakes,
      rec_drinks: _drinks,
    }
    res.render('index', page_data);
})

app.get('/login', (req, res) => { // root-index page
    res.locals.user = current_user;
    res.render('login_register');
})

// listen log
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })