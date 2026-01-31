import './assets/main.css'
import '@/assets/js/accordion.js'
import '@/assets/js/modal.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import Toast/* , { PluginOptions } */ from "vue-toastification";
import "vue-toastification/dist/index.css";
const toastOptions = {
  position: "top-center",
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.45,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: false,
  rtl: false,

  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: true
}


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.use(Toast, toastOptions);

app.mount('#app')
