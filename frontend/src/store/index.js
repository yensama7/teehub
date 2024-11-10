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
        state.cart = JSON.parse(localStorage.getItem('cart'))
      } else {
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }

      if (localStorage.getItem('token')) {
        state.token = localStorage.getItem('token')
        state.isAuthenticated = true
      } else {
        state.token = ''
        state.isAuthenticated = false
      }
    },
    addOrUpdateCartItem(state, item) {
      const existingItem = state.cart.items.find(i => i.product.id === item.product.id && i.size === item.size)

      // Check stock availability
      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity
        if (newQuantity > item.stock) {
          alert(`Only ${item.stock} items are in stock for the selected size.`)
          existingItem.quantity = item.stock // Limit quantity to stock level
        } else {
          existingItem.quantity = newQuantity
        }
      } else {
        if (item.quantity > item.stock) {
          alert(`Only ${item.stock} items are in stock for the selected size.`)
          item.quantity = item.stock // Set quantity to available stock
        }
        state.cart.items.push(item)
      }

      // Save updated cart to localStorage
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
  actions: {},
  modules: {}
})
