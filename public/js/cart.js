$(document).ready(() => {
    $('.btn-order').on('click', addToCart);
    $('.cart__item__btn--remove').on('click', removeFromCart);
    $('.popover-dismiss').popover({
        trigger: 'focus'
    })
    $(function () {
        $('[data-toggle="popover"][data-timeout]').popover({ trigger:"manual" }).click(function() { 
            var pop = $(this); 
            pop.popover("show") 
            pop.on('shown.bs.popover',function() { 
             setTimeout(function() {
              pop.popover("hide")}, $(this).data("timeout")); 
            })
        })
    })
});



function addToCart() {
    var id = $(this).data('id');
    var quantity = $('#qtyField') ? Number($('#qtyField').val()) : 1;
    $.ajax({
        url: '/cart',
        type: 'POST',
        data: { id, quantity },
        success: result => {
            
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
            
            $('#cart-badge').html(result.totalQuantity);
            $(`#productRow-${id}`).remove();

            let emptyMess = "Your cart is empty. Please, go shopping and pick at least one product.";

            if(result.totalQuantity == 0)
                $('#cart').html(`<p class="mx-auto">${emptyMess}<p>`);
            let totalPrice = Number(result.totalPrice);
           
            $('.confirm-payment_data-total').html(`$${totalPrice}`);
            let discount = Number($(".confirm-payment_data-discount__value").text())
           
            let afterPrice = (totalPrice * (1 - discount / 100)).toFixed(2);
            $('.confirm-payment_data-after').html(`$${afterPrice}`);
        }
    })
}

function emptyCart() {
    $.ajax({
        url: '/cart/empty',
        type: 'POST',
        success: result => {
            
            $('#cart-badge').html(0);

            let emptyMess = "Your cart is empty. Please, go shopping and pick at least one product.";

            $('#cart').html(`<p class="mx-auto">${emptyMess}<p>`);
            
           
            $('.confirm-payment_data-total').html(`$0`);
            
            $('.confirm-payment_data-after').html(`$0`);
        }
    })
    document.location.href="/cart"; 
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
            console.log("ok");
            // $('#cart-badge').html(result.totalQuantity);
            emptyCart();
        },
    })
}