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
                <option
                    v-for="size in product.sizes"
                    :key="size.size.id"
                    :value="size.size.id"
                    :disabled="size.stock === 0"
                >
                    {{ size.size.name }} <span v-if="size.stock === 0"> (Out of Stock)</span>
                </option>
            </select>
        </div>
    </div>
    <p v-if="sizeError" class="help is-danger">Please select a size</p>
    <p v-if="sizeStock < 5 && sizeStock > 0" class="help is-warning">Only {{ sizeStock }} left in stock!</p>
</div>

<!-- Quantity input and Add to Cart button -->
<div class="field has-addons mt-6">
    <div class="control">
        <input
            type="number"
            class="input"
            :min="1"
            :max="sizeStock"
            v-model.number="quantity"
            :disabled="sizeStock === 0"
        />
    </div>
    <div class="control">
        <button class="button is-success" @click="addToCart" :disabled="sizeStock === 0">Add to cart</button>
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
            currentPrice: 0, // To hold the current price based on size
            sizeStock: 0,  // Track stock for selected size
        }
    },
    computed: {
        isOutOfStock() {
            return this.product.is_out_of_stock;
        },
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
            this.updatePriceAndStock(newSize);
        },
        quantity(newQuantity) {
        if (this.sizeStock === 0) {
            // If stock is 0, set quantity to 0
            this.quantity = 0;
        } else if (newQuantity > this.sizeStock) {
            // Enforce maximum quantity based on stock availability
            this.quantity = this.sizeStock;
        } else if (newQuantity < 1) {
            // Set minimum quantity to 1 if there is stock
            this.quantity = 1;
        }
    }
    },
    mounted() {
        this.getProduct();
    },
    methods: {

        updatePriceAndStock(selectedSize) {
        const sizePriceObj = this.product.sizes.find(size => size.size.id === selectedSize);
        this.currentPrice = sizePriceObj ? sizePriceObj.price : 0;
        this.sizeStock = sizePriceObj ? sizePriceObj.stock : 0;

        // Restrict quantity based on available stock
        this.quantity = this.sizeStock > 0 ? Math.min(this.quantity, this.sizeStock) : 0;
},

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
            duration: 2000,
        });
        return;
    }

    // Check total quantity in cart for selected size
    const existingItem = this.$store.state.cart.items.find(
        item => item.product.id === this.product.id && item.size === this.selectedSize
    );
    const totalInCart = existingItem ? existingItem.quantity : 0;
    
    if (totalInCart + this.quantity > this.sizeStock) {
        toast({
            message: `Cannot add more than ${this.sizeStock} for this size.`,
            type: 'is-danger',
            duration: 2000,
        });
        return;
    }

    this.sizeError = false;

    const item = {
        product: this.product,
        quantity: this.quantity,
        size: this.selectedSize,
    };

    this.$store.commit('addOrUpdateCartItem', item);

    toast({
        message: 'Product added to the cart',
        type: 'is-success',
        duration: 2000,
    });
}
}
}
</script>
