import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import apiClient from './plugins/apiClient'

const app = createApp(App)

app.use(router)
app.use(apiClient)

app.mount('#app')
