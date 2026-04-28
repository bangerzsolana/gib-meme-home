import { createApp } from 'vue'
import App from './App.vue'
import Trailer from './Trailer.vue'
import './style.css'

const isTrailer = window.location.search.includes('trailer') ||
                  window.location.pathname === '/trailer'

createApp(isTrailer ? Trailer : App).mount('#app')
