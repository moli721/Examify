
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueCookies from 'vue3-cookies'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080';

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(VueCookies)
app.use(router)


app.mount('#app')
