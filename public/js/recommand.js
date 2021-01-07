var btnChange; 

var loadCakes = function(event) {
    btnChange = event.target;
    var cakes = document.getElementById('cakes');
	cakes.style.display = "flex";
    cakes.style.alignItems = "center";
};

var loadDrinks = function(event) {
    btnChange = event.target;

    var drinks = document.getElementById('drinks');
	drinks.style.display = "flex";
    drinks.style.alignItems = "center";
};

var cake_close = function() {
    var drinks = document.getElementById('cakes');
    drinks.style.display = "none";
}

var drink_close = function() {
    var drinks = document.getElementById('drinks');
    drinks.style.display = "none";
}


var ChoosenOne = function(event){
    id1 = btnChange.id;
    id2 = event.target.id;
    var drinks = document.getElementById('drinks');
    var cakes = document.getElementById('cakes');
    drinks.style.display = "none";
    cakes.style.display = "none";

    $.ajax({
        url: '/admin/get_rcm_product',
        type: 'POST',
        data: { id1, id2 },
        success: function() {
            location.reload();
        }
    })  
}