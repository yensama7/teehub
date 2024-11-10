<template>
    <div class="column is-3">
        <div class="box">
            <figure class="image mb-4" style="width: 300px; height: 300px; overflow: hidden;">
                <img v-bind:src="product.get_thumbnail" alt="Product Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
            </figure>

            <h3 class="is-size-4">{{ product.name }}</h3>
            <p class="is-size-6 has-text-grey">{{ formattedPrice }}</p> <!-- Display formatted price -->

            <div v-if="isOutOfStock">
                <button class="button is-danger mt-4" disabled>Out of Stock</button>
            </div>
            <div v-else>
                <router-link v-bind:to="product.get_absolute_url" class="button is-dark mt-4">View details</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductBox',
    props: {
        product: Object // collects data from another page
    },
    computed: {
        formattedPrice() {
            // Extract prices from the product sizes
            const prices = this.product.sizes.map(size => size.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            // If all prices are the same, return that price
            if (minPrice === maxPrice) {
                return `$${minPrice}`;
            }
            // Otherwise, return a price range
            return `$${minPrice} - $${maxPrice}`;
        },
        isOutOfStock() {
            // Check if all sizes for this product have a stock level of 0
            return this.product.sizes.every(size => size.stock === 0);
        }
    }
}
</script>
