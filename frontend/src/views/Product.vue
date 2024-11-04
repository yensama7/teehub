<template>
    <div class="page-product">
        <div class="columns is-multiline">
            <div class="column is-9">
                <figure class="image mb-6">
                    <img :src="currentImageSrc" alt="Product Image">
                </figure>

                 <!-- Navigation buttons for image gallery -->
                 <div class="buttons is-centered">
                    <button class="button is-light" @click="prevImage" :disabled="currentImageIndex === 0">
                        Previous
                    </button>
                    <button class="button is-success" @click="nextImage" :disabled="currentImageIndex === allImages.length - 1">
                        Next
                    </button>
                </div>

                <h1 class="title">{{ product.name }}</h1>
                <p>{{ product.description }}</p>
            </div>

            <div class="column is-3">
                <h2 class="subtitle">Information</h2>
                <p><strong>Price: </strong>${{ currentPrice }}</p> <!-- Change to currentPrice -->

                <!-- Size selection dropdown -->
                <div class="field">
                    <label class="label">Size</label>
                    <div class="control">
                        <div class="select">
                            <select v-model="selectedSize">
                                <option disabled value="">Select a size</option>
                                <option v-for="size in product.sizes" :key="size.size.id" :value="size.size.id">
                                    {{ size.size.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <p v-if="sizeError" class="help is-danger">Please select a size</p>
                </div>

                <!-- Quantity input and Add to Cart button -->
                <div class="field has-addons mt-6">
                    <div class="control">
                        <input type="number" class="input" min="1" v-model="quantity">
                    </div>
                    <div class="control">
                        <a class="button is-dark" @click="addToCart">Add to cart</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
    name: 'Product',
    data() {
        return {
            product: {},
            quantity: 1,
            selectedSize: '',
            sizeError: false,
            currentImageIndex: 0, // Index to track current image in the image gallery
            currentPrice: 0 // To hold the current price based on size
        }
    },
    computed: {
        // Combine main image and product images into one array
        allImages() {
            return [this.product.get_image, ...(this.product.images || []).map(img => img.get_images)];
        },
        // Determine which image to show based on the index
        currentImageSrc() {
            return this.allImages[this.currentImageIndex];
        }
    },
    watch: {
        selectedSize(newSize) {
            this.updatePrice(newSize);
        }
    },
    mounted() {
        this.getProduct();
    },
    methods: {
        async getProduct() {
            this.$store.commit('setIsLoading', true);
            const category_slug = this.$route.params.category_slug;
            const product_slug = this.$route.params.product_slug;

            try {
                const response = await axios.get(`/core/v1/products/${category_slug}/${product_slug}`);
                this.product = response.data;
                this.selectedSize = '';  // Force user to explicitly select a size
                this.currentPrice = this.product.sizes.length > 0 ? this.product.sizes[0].price : 0; // Set initial price
                document.title = this.product.name + ' | TeeHub';
            } catch (error) {
                console.log(error);
            }

            this.$store.commit('setIsLoading', false);
        },
        updatePrice(selectedSize) {
            const sizePriceObj = this.product.sizes.find(size => size.size.id === selectedSize);
            this.currentPrice = sizePriceObj ? sizePriceObj.price : 0; // Update current price based on selected size
        },
        // Method to move to the previous image in the gallery
        prevImage() {
            if (this.currentImageIndex > 0) {
                this.currentImageIndex--;
            }
        },
        
        // Method to move to the next image in the gallery
        nextImage() {
            if (this.currentImageIndex < this.allImages.length - 1) {
                this.currentImageIndex++;
            }
        },

        addToCart() {
            if (!this.selectedSize) {
                this.sizeError = true;
                toast({
                    message: 'Please select a size before adding to the cart',
                    type: 'is-danger',
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    position: 'bottom-right',
                });
                return;
            }

            // Reset the error if size is selected
            this.sizeError = false;

            const item = {
                product: this.product,
                quantity: this.quantity,
                size: this.selectedSize
            };

            // Commit the action to Vuex to handle cart item addition
            this.$store.commit('addOrUpdateCartItem', item);

            toast({
                message: 'The product was added to the cart',
                type: 'is-success',
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: 'bottom-right',
            });
        }
    }
}
</script>
