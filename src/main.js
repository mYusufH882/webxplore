import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import apiClient from './plugins/apiClient'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas);

const app = createApp(App)

app.use(router)
app.use(apiClient)

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app')
