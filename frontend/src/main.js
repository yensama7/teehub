import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'https://b28f-197-211-58-107.ngrok-free.app'

createApp(App).use(store).use(router, axios).mount('#app')
