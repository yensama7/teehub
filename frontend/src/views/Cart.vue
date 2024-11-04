<template>
    <div class="page-cart">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Cart</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth" v-if="cartTotalLength"> <!--comes on if we have items in the cart-->
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <CartItem
                        v-for="(item, index) in cart.items"
                        :key="item.product.id + '-' + item.size.id"
                        :initialItem="item"
                        @removeFromCart="removeFromCart" /><!-- iterates over cart.items to bind product and size -->
                    </tbody>
                </table>

                <p v-else>You don't have any products in your cart...</p> <!--comes on if we don't-->
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Summary</h2>

                <strong>${{ cartTotalPrice.toFixed(2) }}</strong>, {{ cartTotalLength }} items

                <hr>

                <router-link to="/cart/checkout" class="button is-dark">Proceed to checkout</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import CartItem from '@/components/CartItem.vue'

export default {
    name: 'Cart',
    components: {
        CartItem // access cart item  components
    },
    data() {
        return {
            cart: {
                items: []
            }
        }
    },
    mounted() {
        this.cart = this.$store.state.cart // access cart from vuex store
    },
    methods: {
        removeFromCart(item) {
            // Filter by both product ID and size
            this.cart.items = this.cart.items.filter(i => i.product.id !== item.product.id || i.size !== item.size) // removes the product from the crt
            this.updateCart() // calls an update function
        },
        updateCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart)) // Persist cart updates
        }
    },
    computed: {
        cartTotalLength() {
            return this.cart.items.reduce((acc, curVal) => acc + curVal.quantity, 0)
        },
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curVal) => {const sizeDetail = curVal.product.sizes.find(s => s.size.id === curVal.size.id);
            const price = sizeDetail ? parseFloat(sizeDetail.price) : 0;
            return acc + price * curVal.quantity;}, 0);
        },
    }
}
</script>
