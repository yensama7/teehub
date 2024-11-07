<template>
    <div class="page-checkout">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Size</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in cart.items"
                            v-bind:key="item.product.id + '-' + item.size"
                        >
                            <td>{{ item.product.name }}</td>
                            <td>${{ getSelectedSizePrice(item) }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>${{ getItemTotal(item) }}</td>
                            <td>{{ getSizeName(item) }}</td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>${{ cartTotalPrice }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Shipping details</h2>

                <p class="has-text-grey mb-4">* All fields are required</p>

                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>First name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>Last name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>E-mail*</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email">
                            </div>
                        </div>

                        <div class="field">
                            <label>Phone*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone">
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field">
                            <label>Address*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>

                        <div class="field">
                            <label>Place*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="place">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                <hr>

                <div id="card-element" class="mb-5"></div>

                <template v-if="cartTotalLength">
                    <hr>
                
                    <paystack
                        :amount="paystack_price"
                        :email="email"
                        :paystackkey="paystackkey"
                        :reference="generateReference"
                        :callback="callback"
                        :close="close"
                        :embed="false"
                        :disabled="!isFormValid" 
                        class="button is-dark"
                    >
                        <i class="fas fa-money-bill-alt"></i>
                        Make Payment
                    </paystack>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import paystack from 'vue-paystack'

export default {
    components: {
        paystack,
    },
    name: 'Checkout',
    data() {
        return {
            cart: {
                items: []
            },
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            place: '',
            errors: [],
            paystackkey: 'pk_test_92bf254a3195e42b377cacf8c58a26a1adebb0cb', // public key
        }
    },
    mounted() {
        document.title = 'Checkout | TeeHub';
        this.cart = this.$store.state.cart;
    }, 
    methods: {
        getSizeName(item) {
            const sizeDetail = item.product.sizes.find(s => s.size.id === item.size);
            return sizeDetail ? sizeDetail.size.name : 'N/A';
        },
        getSelectedSizePrice(item) {
            const sizeDetail = item.product.sizes.find(s => s.size.id === item.size);
            return sizeDetail ? parseFloat(sizeDetail.price) : 0;
        },
        callback(response) {
            if (response.status === "success") {
                const items = this.cart.items.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity,
                    price: this.getSelectedSizePrice(item) * item.quantity,
                    sizes: this.getSizeName(item)
                }));
                
                const data = {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email,
                    address: this.address,
                    place: this.place,
                    phone: this.phone,
                    items: items,
                    transaction_id: response.reference
                };

                axios
                    .post('/core/v1/checkout/', data)
                    .then(response => {
                        console.log("Checkout successful", response);
                        this.$store.commit('clearCart');
                        this.$router.push('/cart/success').then(() => window.location.reload());
                    })
                    .catch(error => {
                        console.error("Checkout error", error);
                        this.errors.push('Something went wrong with your order. Please try again.');
                    });
            } else {
                this.errors.push('Payment was not successful. Please try again.');
            }
        },
        close() {
            this.errors.push('Payment modal closed');
            this.$router.push('/cart');
        },
        getItemTotal(item) {
            return item.quantity * this.getSelectedSizePrice(item);
        }
    },
    computed: {
        isFormValid() {
            this.errors = [];
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!this.first_name) this.errors.push('The first name field is missing!');
            if (!this.last_name) this.errors.push('The last name field is missing!');
            if (!this.email) this.errors.push('The email field is missing!');
            if (this.email && !emailPattern.test(this.email)) this.errors.push('Invalid email');
            if (!this.phone) this.errors.push('The phone field is missing!');
            if (!this.address) this.errors.push('The address field is missing!');
            if (!this.place) this.errors.push('The place field is missing!');
            return this.errors.length === 0;
        },
        cartTotalPrice() {
            return this.cart.items.reduce((acc, item) => acc + this.getSelectedSizePrice(item) * item.quantity, 0);
        },
        cartTotalLength() {
            return this.cart.items.reduce((acc, item) => acc + item.quantity, 0);
        },
        generateReference() {
            return new Date().getTime().toString();
        },
        paystack_price() {
            return this.cartTotalPrice * 100; // Convert to kobo
        }
    }
}
</script>
