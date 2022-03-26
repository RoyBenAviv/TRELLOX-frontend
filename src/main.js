import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/styles.scss'
import { focusDirective, clickOutside } from './directives'

const app = createApp(App)

app.directive('focus', focusDirective)
app.directive('click-outside', clickOutside)

app.use(router)
app.use(store)
app.mount('#app')
