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
const bcrypt = require('bcrypt');
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
var accountFile = JSON.parse(fs.readFileSync(__dirname + "/public/json/account.json"));

/*
*/
var blogs = JSON.parse(fs.readFileSync(__dirname + "/public/json/blogs.json"));

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

function _getCakes(products) { // return products that have prop type = cake
    return products.filter(product => product.type == 'cake');
}


function _getTeas(products) { // return products that have prop type = tea
    return products.filter(product => product.type == 'tea');
}


function _getDrinks(products) { // return products that have prop type = drink
    return products.filter(product => product.type == 'drink');
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
    let _cakes = _getNElements(_getCakes(products), 5); // get 5 recommend cakes
    let _drinks = _getNElements(_getTeas(products), 3).concat(_getNElements(_getDrinks(products), 2)); // get recommend drinks (3 teas + 2 drinks)
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

function checkExist(ArrAcc, newAcc){

    var check = false;
    ArrAcc.forEach(ele => {
        if (String(ele.account) === String(newAcc))
            check = true;
        }
    )
    return check;
}

app.post('/get_infor_register', (req, res) => {
    current_user = ADMIN_USER;
    res.locals.user = current_user;

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
            fs.writeFileSync(__dirname + "/public/json/account.json", JSON.stringify(accountFile));

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

app.post('/get_infor_login', (req, res) => {
    current_user = ADMIN_USER;
    res.locals.user = current_user;

    if (checkLogin(accountFile.userInfor, req.body.logAcc, req.body.logPass)){
        res.redirect("/");
    }
    else{
        res.render('login_register', {logAnnoun: 'Invalid Username or Password'});
    }

});

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

app.get('/add_ads', (req, res) => {
    current_user = ADMIN_USER;
    res.locals.user = current_user;

    res.render('add_ads');
});

app.get('/menu', (req, res) => { // menu page
    models.Product
    .findAll({
        raw : true
    })
    .then(products => {
        // ---- get user
        res.locals.user = current_user;

        // ---- get rows with each row have 3 products
        var rows_data = _getRows(products, 3);
        
        // ---- Prepare data for page
        var page_data = {
        title: "TeaCake - Menu",
        rows: rows_data
        }

        // ---- Render home page
        res.render('menu', page_data);
    })
    .catch(err => {
        res.json(err);
    })
})

app.get('/product', (req, res) => { // product pages
    models.Product
    .findByPk(Number(req.query.id), {raw : true})
    .then(product => {
        if (product === null) {
            res.send("Error 404: File not found!!");
        }
        else {
            // ---- Prepare data for page
            var page_data = {
                title: `TeaCake - ${product.name}`,
                product: product
            }

            // ---- Render home page
            res.render('product', page_data);

        }
    })
    .catch(err => {
        res.json(err);
    })
})


app.get('/credit', (req, res) => { // credit page
    // ---- get user
    res.locals.user = current_user;

    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - Credit",
      members: members
    }

    // ---- Render home page
    res.render('credit', page_data);
})

app.get('/cart', (req, res) => { // cart page
    // ---- get user
    res.locals.user = current_user;

    let cart_items = _getNElements(_getCakes(products), 2).concat(_getNElements(_getTeas(products), 1)).concat(_getNElements(_getDrinks(products).drinks, 1));
    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - Cart",
      products: cart_items
    }

    // ---- Render home page
    res.render('cart', page_data);
})

app.get('/history', (req, res) => { // cart page
    // ---- get user
    res.locals.user = current_user;

    let cart_items = _getNElements(products.cakes, 2).concat(_getNElements(products.teas, 1)).concat(_getNElements(products.drinks, 1));
    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - History",
      products: cart_items
    }

    // ---- Render home page
    res.render('history', page_data);
})

app.get('/profile', (req, res) => { // profile page
    // ---- get user
    res.locals.user = current_user;

    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - Profile",
    }

    // ---- Render home page
    res.render('profile', page_data);
})

app.get('/contact', (req, res) => { // contact page
    // ---- get user
    res.locals.user = current_user;

    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - Contact",
    }

    // ---- Render home page
    res.render('contact', page_data);
})

app.get('/blog', (req, res) => { // blog page
    // ---- get user
    res.locals.user = current_user;
    var rows = _getRows(blogs, 3);
    // ---- Prepare data for page
    var page_data = {
      title: "TeaCake - Blog",
      rows: rows
    }

    // ---- Render home page
    res.render('blog', page_data);
})

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