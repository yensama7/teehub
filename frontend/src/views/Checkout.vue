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
                    > <!--disables the button till the requirements are met-->
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
            paystackkey: 'pk_test_92bf254a3195e42b377cacf8c58a26a1adebb0cb',// public key
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
        callback: function (response) {
            // Check the status of the transaction
        if (response.status === "success") {
            // Transaction was successful
            const items = [];
            for (let i = 0; i < this.cart.items.length; i++) {
                const item = this.cart.items[i];
                const obj = {
                    product: item.product.id,
                    quantity: item.quantity,
                    price: this.getSelectedSizePrice(item) * item.quantity,
                    sizes: item.sizes
                };
                items.push(obj);
            }

            const data = {
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email,
                address: this.address,
                place: this.place,
                phone: this.phone,
                items: items,
                transaction_id: response.reference // Store transaction reference
            };

            axios
                .post('/core/v1/checkout/', data)
                .then(response => {
                    // Handle the successful response from your server
                    console.log("Checkout successful", response);
                    // Optionally redirect or show a success message
                    this.$store.commit('clearCart')
                    this.$router.push('/cart/success').then(() => {
                        window.location.reload();
                    });
                })
                .catch(error => {
                    console.error("Checkout error", error);
                    this.errors.push('Something went wrong with your order. Please try again.');
                });

        } else {
            // Transaction failed
            console.error("Transaction failed", response);
            this.errors.push('Payment was not successful. Please try again.');
        }
        },
        close: function () {
            this.errors = [];
            // User closed the payment modal
            this.$router.push('/cart')
            this.errors.push('Payment modal closed')
            console.log('Payment modal closed');
        },
        getItemTotal(item) {
        return item.quantity * this.getSelectedSizePrice(item);
    },

    
        submitForm() {
            this.errors = [];
            
            const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (this.first_name === '') {
                this.errors.push('The first name field is missing!');
                return false; //invalid form
            }

            else if (this.last_name === '') {
                this.errors.push('The last name field is missing!');
                return false; //invalid form
            }

            else if (this.email === '') {
                this.errors.push('The email field is missing!');
                return false; //invalid form
            }
            
            else if (!emailpattern.test(this.email)){
                this.errors.push('invalid email');
                return false; //invalid form
            }
            

            else if (this.phone === '') {
                this.errors.push('The phone field is missing!');
                return false; //invalid form
            }

            else if (this.address === '') {
                this.errors.push('The address field is missing!');
                return false; //invalid form
            }

            else if (this.place === '') {
                this.errors.push('The place field is missing!');
                return false; //invalid form
            }

            else if (!this.errors.length) {
                this.$store.commit('setIsLoading', true);

                this.$store.commit('setIsLoading', false);
                return true; // valid form

        }
    
        

                
            }
        },
    computed: {
        isFormValid() {
            // Validate fields
            const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.first_name === '' || 
                this.last_name === '' || 
                this.email === '' || 
                !emailpattern.test(this.email) || 
                this.phone === '' || 
                this.address === '' || 
                this.place === '') {
                this.submitForm()
                return false; // Form is invalid
            }
            return true; // Form is valid
        },

    cartTotalPrice() {
        return this.cart.items.reduce((acc, item) => {
        return acc + (this.getSelectedSizePrice(item) * item.quantity);
    }, 0);
    },
    cartTotalLength() {
        return this.cart.items.reduce((acc, curVal) => {
            return acc += curVal.quantity;
        }, 0);
    },
    generateReference(){
        let date = new Date();
        return date.getTime().toString(); // gets reference based on time
    },
    isValid() {
        return this.submitForm(); // Call submitForm method
    },
    paystack_price(){
        return this.cartTotalPrice * 100; // Convert to kobo for Paystack
    }
}
    }
    

</script>
