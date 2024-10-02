<template>
    <tr>
        <td>
            <router-link :to="item.product.get_absolute_url">{{ item.product.name }}</router-link> <!-- gets product name-->
            <br>
            <!-- Display the selected size -->
            <small>Size: {{ item.size }}</small> <!-- Show the selected size here -->
        </td>
        <td>${{ item.product.price }}</td>
        <td>
            <a @click="decrementQuantity(item)">-</a> <!--calls decrement quantity function-->
            {{ item.quantity }}
            <a @click="incrementQuantity(item)">+</a> <!--calls increment quantity function-->
        </td>
        <td>${{ getItemTotal(item).toFixed(2) }}</td> <!--calls getItemtotal function-->
        <td><button class="delete" @click="removeFromCart(item)"></button></td> <!--when clicked it removes from cart-->
    </tr>
</template>


<script>
export default {
    name: 'CartItem',
    props: {
        initialItem: Object  // expects data from another page before the component can be used and saves it in initialItem
    },
    data() {
        return {
            item: this.initialItem  // adding to the array item
        }
    },
    methods: {
        getItemTotal(item) {
            return item.quantity * item.product.price // gets the quantity and price from item
        },
        decrementQuantity(item) {
            item.quantity -= 1 // decreases item quantity

            if (item.quantity === 0) {
                this.$emit('removeFromCart', item)  // removes item from cart if === o
            }

            this.updateCart()
        },
        incrementQuantity(item) {
            item.quantity += 1 // increases quantity

            this.updateCart() // calls update cart function
        },
        updateCart() {
            localStorage.setItem('cart', JSON.stringify(this.$store.state.cart))  // access the vuex store and update cart
        },
        removeFromCart(item) {
            this.$emit('removeFromCart', item)

            this.updateCart()
        },
    },
}
</script>
