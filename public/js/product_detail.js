
function increaseQty() {
    let quantity = document.querySelector("#qty-input");
    quantity.value = ++Number(quantity.value); 
}

function calculateChart(){
    

    // for (let i = 1; i < 6; i++){
    //     var column = document.getElementById(`c${i}`);
    //     console.log(column)
    //     column.style.height = $(`#c${i}`).data('percentage');
    // }

    $('.chartBackground li .columns').each(function(){
        var percentage = $(this).data('percentage');
        $(this).animate({
            'height' : percentage*2
        })
    })

    // var column = document.getElementById(`c5`);
    // console.log(column)
    // column.style.height = $(`#c5`).data('percentage');
}
