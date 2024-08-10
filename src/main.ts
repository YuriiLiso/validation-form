import './assets/styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';

const app = createApp(App);

app.use(Vue3Toastify, {
  autoClose: 3000,
} as ToastContainerOptions);

app.mount('#app')
