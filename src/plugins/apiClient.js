import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  install(app) {
    app.config.globalProperties.$apiClient = apiClient
  }
}
