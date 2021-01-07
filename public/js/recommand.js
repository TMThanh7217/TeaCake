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

var ChoosenOne = function(event){
    id1 = btnChange.id;
    id2 = event.target.id;
    $.ajax({
        url: '/admin/get_rcm_product',
        type: 'POST',
        data: { id1, id2 },
    })  
}