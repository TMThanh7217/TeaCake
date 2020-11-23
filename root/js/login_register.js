var loginform = document.getElementById("input-login");
var registerform = document.getElementById("input-register");
var button = document.getElementById("btn");
var TnK_img = document.getElementById("TnK_img");
var formbox = document.getElementById("form-box");
var buttonbox = document.getElementById("button-box");
var bg = document.getElementById("background");

function login(){
    loginform.style.left = "50px";
    registerform.style.left = "450px";
    button.style.left = "0px";
    button.style.background = "linear-gradient(to right, #4a64f7, #dae3e4)";
    formbox.style.borderColor = "#8093fc";
    TnK_img.style.display = "inline";
    buttonbox.style.boxShadow = "0 0 30px 20px #3623631f";
    bg.style.backgroundImage = "linear-gradient(rgba(38, 207, 212, 0.4),rgba(214, 141, 30, 0.2)),url(../images/tea_cake_bg.jpg)";
}

function register(){
    loginform.style.left = "-400px";
    registerform.style.left = "50px";
    button.style.left = "100px";
    button.style.background = "linear-gradient(to right, #f5dacd, #f56623)";
    formbox.style.borderColor = "#fa823c";
    TnK_img.style.display = "none";
    buttonbox.style.boxShadow = "0 0 30px 20px #ff24241f";
    bg.style.backgroundImage = "linear-gradient(rgba(214, 141, 30, 0.2), rgba(38, 207, 212, 0.4)),url(../images/tea_cake_bg.jpg)";
}