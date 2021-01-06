'use strict';

module.exports = class Cart {
    constructor(oldCart) {
        this.items = oldCart.items || {};
        this.totalQuantity = oldCart.totalQuantity || 0;
        this.totalPrice = oldCart.totalPrice || 0;
        this.address = oldCart.address || "";
        this.paymentMethod = oldCart.paymentMethod || "COD";
    }
    
    getTotalQuantity() {
        var totalQuantity = 0;
        for (let id in this.items)
            totalQuantity += Number(this.items[id].quantity);
        return totalQuantity;
    };

    getTotalPrice() {
        var totalPrice = 0;
        for (let id in this.items)
            totalPrice += Number(this.items[id].price);
        return totalPrice;
    };

    add = (item, id, quantity) => {
        var storedItem = this.items[id];

        if(!storedItem) {
            this.items[id] = {item: item, quantity: 0, price: 0};
            storedItem = this.items[id];
        }
        
        storedItem.quantity += Number(quantity);
        
        storedItem.price = Number(storedItem.item.price) * storedItem.quantity;
        
       

        this.totalPrice = this.getTotalPrice();
        
        this.totalQuantity = this.getTotalQuantity();
        
        return this.getCart();
    };

    remove(id) {
        var storedItem = this.items[id];
        if(storedItem) {
            delete this.items[id];
            this.totalPrice = this.getTotalPrice();
            this.totalQuantity = this.getTotalQuantity();
        }
        return this.getCart();
    };

    update(id, quantity){
        var storedItem = this.items[id];
        if (storedItem && quantity > 0) {
            storedItem.quantity = quantity;
            storedItem.price = Number(storedItem.item.price) * storedItem.quantity;
            storedItem.totalPrice = this.getTotalPrice();
            storedItem.totalQuantity = this.getTotalQuantity();
        }
        return this.getCartItem(id);
    };

    empty (){
        this.items = {};
        this.totalPrice = 0;
        this.totalQuantity = 0;
    };

    getItemsList() {
        var list = [];
        for(let id in this.items) {
            this.items[id].price = Number(this.items[id].price).toFixed(2);
            list.push(this.items[id]);
        }
        return list;
    };

    getCart() {
        return {
            items: this.getItemsList(),
            totalQuantity: this.totalQuantity,
            totalPrice: this.totalPrice.toFixed(2),
            address: this.address,
            paymentMethod: this.paymentMethod
        }
    }

    getCartItem(id) {
        return {
            item: this.items[id],
            totalQuantity: this.totalQuantity, 
            totalPrice: this.totalPrice
        }
    }

    isEmpty() {
        return this.totalQuantity == 0;
    }
}