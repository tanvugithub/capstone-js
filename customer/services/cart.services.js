export class cartServices {

    carts = localStorage.getItem("carts")?.length > 0 ? JSON.parse(localStorage.getItem("carts")) : [];

    add(cartItem) {
        // item: {id, quantity, product}
        //this.carts.push(product);
        let isExistIndex = this.carts.findIndex(c => c.id === cartItem.id);

        if (isExistIndex > -1) {
            this.carts[isExistIndex].quantity = this.carts[isExistIndex].quantity + cartItem.quantity;
        } else {
            this.carts.push(cartItem);
        }
        // update local storage
        localStorage.setItem("carts", JSON.stringify(this.carts));
    }

    update(id, newQuantity) {
        let isExistIndex = this.carts.findIndex(c => c.id === +id);
        if (isExistIndex > -1) {

            if (+newQuantity < 1) {
                this.carts[isExistIndex].quantity = 1;
            } else {
                this.carts[isExistIndex].quantity = +newQuantity;
            }

            // update local storage
            localStorage.setItem("carts", JSON.stringify(this.carts));
        }
    }

    updateWithButton(id, type) {
        let isExistIndex = this.carts.findIndex(c => c.id === +id);
        if (isExistIndex > -1) {

            if (type === '+') {
                this.carts[isExistIndex].quantity++;
            } else if (type === '-') {
                if (this.carts[isExistIndex].quantity > 1) {
                    this.carts[isExistIndex].quantity--;
                }
            }

            // update local storage
            localStorage.setItem("carts", JSON.stringify(this.carts));


        }
    }

    delete(id) {
        let isExistIndex = this.carts.findIndex(c => c.id === +id);

        if (isExistIndex > -1) {
            this.carts = this.carts.filter((c) => {
                return +c.id !== +id;
            });

            localStorage.setItem("carts", JSON.stringify(this.carts));
        }
    }

    reset() {
        this.carts = [];
        localStorage.setItem("carts", JSON.stringify(this.carts));
    }

    totalOrderPrice() {
        const all = this.carts.reduce((prev, curr, index) => {
            return prev + (curr.quantity * curr.product.price);
        }, 0)

        return all;
    }
}