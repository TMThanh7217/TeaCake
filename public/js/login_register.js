var loginform = document.getElementById("input-login");
var registerform = document.getElementById("input-register");
var button = document.getElementById("btn");
var TnK_img = document.getElementById("TnK_img");
var formbox = document.getElementById("form-box");
var buttonbox = document.getElementById("button-box");
var bg = document.getElementById("background");

var login_btn = document.getElementById("login-btn");
login_btn.onclick = 
function login(){
    loginform.style.left = "50px";
    registerform.style.left = "450px";
    button.style.left = "0px";
    button.style.background = "linear-gradient(to right, #4a64f7, #dae3e4)";
    formbox.style.borderColor = "#8093fc";
    TnK_img.style.display = "inline";
    buttonbox.style.boxShadow = "0 0 30px 20px #3623631f";
    bg.style.backgroundImage = "linear-gradient(rgba(38, 207, 212, 0.4),rgba(214, 141, 30, 0.2)),url(../images/tea_cake_bg.jpg)";
};

var register_btn = document.getElementById("register-btn");
register_btn.onclick = function register(){
    loginform.style.left = "-400px";
    registerform.style.left = "50px";
    button.style.left = "100px";
    button.style.background = "linear-gradient(to right, #f5dacd, #f56623)";
    formbox.style.borderColor = "#fa823c";
    TnK_img.style.display = "none";
    buttonbox.style.boxShadow = "0 0 30px 0px #ff24241f";
    bg.style.backgroundImage = "linear-gradient(rgba(214, 141, 30, 0.2), rgba(38, 207, 212, 0.4)),url(../images/tea_cake_bg.jpg)";
}

// Source: https://www.w3schools.com/js/tryit.asp?filename=tryjs_cookie_username
function userLogin() {
    setCookie("usr", "login", 30);
    userUI();
}

function userLogout() {
    setCookie("usr", "", 30);
    userUI();
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
function getCookie(cname) {
var name = cname + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
    c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
    }
}
return "";
}

function userUI() {
    var user_status = getCookie("usr");
    var login_area = document.getElementById("login-area");
    console.log(user_status);
    console.log(login_area)
    var la_html = "";
    login_area.innerHTML ="";
    if (user_status != "") {
        la_html += "<div class='dropdown nav-item acc-drop p-1 w-75'>"
        la_html += "<button type='button' class='btn dropdown-toggle right-item' data-toggle='dropdown'>"
        la_html += "Account <i class='fa fa-user ml-3' style='font-size: 40px'></i></button>"
        la_html += "<div class='dropdown-menu' style='background: linear-gradient(rgb(217, 230, 233),rgb(168, 236, 216), rgb(211, 231, 122), rgb(236, 222, 19));'>"                      
        la_html += "<a class='dropdown-item' href='../page/profile.html'><i class='fas fa-address-card'></i> Profile</a>"
        la_html += "<a class='dropdown-item' href='#'><i class='fa fa-bell'></i> Notification</a>"
        la_html += "<a class='dropdown-item' href='#'><i class='fa fa-shopping-cart'></i> Shopping cart</a>"
        la_html += "<a class='dropdown-item' href='#'><i class='fa fa-history'></i> History</a>"
        la_html += "<a class='dropdown-item' href='#' onclick='userLogout()'><i class='fas fa-door-open'></i> Logout</a>"
        la_html += "</div></div>"
    }
    else {
        la_html += "<ul class='navbar-nav mx-auto w-100 d-flex justify-content-center'>"   
        la_html += "<li id='login-btn' class='nav-item p-1 right-item w-75' onclick='userLogin()'>"
        la_html += "<a href='./login_register.htm'>Login</a> <i class='fa fa-user' style='font-size: 40px'></i>"
        la_html += "</li>"
        la_html += "</ul>"
    }
    login_area.insertAdjacentHTML("afterbegin",la_html);
}