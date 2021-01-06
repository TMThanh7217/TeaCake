$(document).ready(() => {
    $('.btn-order').on('click', addToCart);
    $('.cart__item__btn--remove').on('click', removeFromCart);
});


function addToCart() {
    var id = $(this).data('id');
    var quantity = $('#qtyField') ? Number($('#qtyField').val()) : 1;
    $.ajax({
        url: '/cart',
        type: 'POST',
        data: { id, quantity },
        success: result => {
            console.log(result.totalQuantity);
            $('#cart-badge').html(result.totalQuantity);
        }
    })  
}

function removeFromCart() {
    var id = $(this).data('id');
    $.ajax({
        url: '/cart/remove',
        type: 'POST',
        data: {id},
        success: result => {
            console.log(result)
            $('#cart-badge').html(result.totalQuantity);
            $(`#productRow-${id}`).remove();
            let totalPrice = Number(result.totalPrice);
           
            $('.confirm-payment_data-total').html(`$${totalPrice}`);
            let discount = Number($(".confirm-payment_data-discount__value").text())
           
            let afterPrice = (totalPrice * (1 - discount / 100)).toFixed(2);
            $('.confirm-payment_data-after').html(`$${afterPrice}`);
        }
    })
}

function Pay() {
    var total = $('#total').html();
    var discount = $('#discount').html();
    var total_after = $('#total_after').html();

    $.ajax({
        url: '/cart/pay',
        type: 'POST',
        data: { total, discount, total_after },
        success: result => {
            console.log(success);
            // $('#cart-badge').html(result.totalQuantity);
        }
    })
}