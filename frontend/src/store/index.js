import { createStore } from 'vuex'

export default createStore({
  state: {
    cart: {
        items: [],
    },
    isAuthenticated: false,
    token: '',
    isLoading: false
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('cart')) {
        state.cart = JSON.parse(localStorage.getItem('cart')) // if cart is caled it will give cart items
      } else {
        localStorage.setItem('cart', JSON.stringify(state.cart))// updates cart
      }

      if (localStorage.getItem('token')) { // if token is caled it will send token
          state.token = localStorage.getItem('token')
          state.isAuthenticated = true
      } else {
          state.token = ''
          state.isAuthenticated = false
      } 
    },
    addOrUpdateCartItem(state, item) {
      const existingItem = state.cart.items.find(i => i.product.id === item.product.id && i.size === item.size)// adds product to cart based on product id and size

      if (existingItem) {
          // If the product with the same size exists, just update the quantity
          existingItem.quantity += item.quantity
      } else {
          // Otherwise, add the new item to the cart
          state.cart.items.push(item)
      }

      // Save updated cart to localStorage or API
      localStorage.setItem('cart', JSON.stringify(state.cart))
  },
    setIsLoading(state, status) {
      state.isLoading = status
    },
    setToken(state, token) {
        state.token = token
        state.isAuthenticated = true
    },  
    removeToken(state) {
        state.token = ''
        state.isAuthenticated = false
    },
    clearCart(state) {
      state.cart = { items: [] }

      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
  },
  actions: {
  },
  modules: {
  }
})