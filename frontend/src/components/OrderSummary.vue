<template>
    <div class="box mb-4">
        <h3 class="is-size-4 mb-6">Order #{{ order.custom_order_id }} - Status: {{ order.delivery_status }}</h3> <!--get order id-->

        <h4 class="is-size-5">Products</h4>

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
                    v-for="item in order.items"
                    v-bind:key="item.product.id + '-' + item.size"
                > <!--iterates over order.items, settingproduct id as unique key-->
                    <td>{{ item.product.name }}</td>
                    <td>${{ item.price }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>${{ getItemTotal(item) }}</td>
                    <td>{{ item.sizes}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'OrderSummary',
    props: {
        order: Object // accepts data from another page
    },
    methods: {
        getItemTotal(item) {
            return item.quantity * item.price
        },
        orderTotalLength(order) {
            return order.items.reduce((acc, curVal) => {
                return acc += curVal.quantity // calculates number of products in cart
            }, 0)
        },
    }
}
</script>