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

module.exports = {
    getRows : _getRows,
    getCakes: _getCakes,
    getDrinks: _getDrinks,
    getTeas: _getTeas,
    getNElements: _getNElements
}