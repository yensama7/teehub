<template>
    <div class="column is-3">
        <div class="box">
            <figure class="image mb-4" style="width: 300px; height: 300px; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                <img v-bind:src="product.get_thumbnail" alt="Product Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
            </figure>

            <h3 class="is-size-4">{{ product.name }}</h3>
            <p class="is-size-6 has-text-grey">{{ formattedPrice }}</p> <!-- Display formatted price -->

            <router-link v-bind:to="product.get_absolute_url" class="button is-dark mt-4">View details</router-link>
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
        }
    }
}
</script>

<style scoped>
.image {
    margin-top: -1.25rem;
    margin-left: -1.25rem;
    margin-right: -1.25rem;
    width: 300px; /* Set width to 300px */
    height: 300px; /* Set height to 300px */
    display: flex; /* Use flexbox to center image */
    justify-content: center; /* Horizontally center image */
    align-items: center; /* Vertically center image */
    overflow: hidden; /* Ensures the image doesn't overflow the container */
}
.image img {
    width: 100%; /* Stretch the image to fill the container */
    height: 100%; /* Make the image take the full height */
    object-fit: contain; /* Crop the image to fit the container */
}
</style>
