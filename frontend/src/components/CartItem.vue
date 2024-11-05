<template>
    <tr>
        <td>
            <router-link :to="item.product.get_absolute_url">{{ item.product.name }}</router-link>
            <br>
            <!-- Display the name of the selected size -->
            <small>Size: {{ getSizeName() }}</small>
        </td>
        <td>${{ getSelectedSizePrice() }}</td> <!-- Display the price for the selected size -->
        <td>
            <a @click="decrementQuantity(item)">-</a>
            {{ item.quantity }}
            <a @click="incrementQuantity(item)">+</a>
        </td>
        <td>${{ getItemTotal() }}</td> <!-- Total for this item -->
        <td><button class="delete" @click="removeFromCart(item)"></button></td>
    </tr>
</template>

<script>
export default {
    name: 'CartItem',
    props: {
        initialItem: Object
    },
    data() {
        return {
            item: this.initialItem
        }
    },
    methods: {
        getSizeName() {
            // Find the size object in product.sizes matching the selected size id
            const sizeDetail = this.item.product.sizes.find(s => s.size.id === this.item.size);
            return sizeDetail ? sizeDetail.size.name : 'N/A'; // Return size name or 'N/A' if not found
        },
        getSelectedSizePrice() {
            // Find the size object in product.sizes that matches the selected size id
            const sizeDetail = this.item.product.sizes.find(s => s.size.id === this.item.size);
            
            // If sizeDetail is found, return the price as a float; otherwise, return 0
            return sizeDetail ? parseFloat(sizeDetail.price) : 0;
        },
        getItemTotal() {
            return this.item.quantity * this.getSelectedSizePrice(); // Multiply quantity by price for total
        },
        decrementQuantity(item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                this.updateCart();
            } else {
                // Emit remove event if quantity would go to 0
                this.$emit('removeFromCart', item);
            }
        },
        incrementQuantity(item) {
            item.quantity += 1;
            this.updateCart();
        },
        updateCart() {
            localStorage.setItem('cart', JSON.stringify(this.$store.state.cart));
        },
        removeFromCart(item) {
            this.$emit('removeFromCart', item);
            this.updateCart();
        }
    }
}
</script>
