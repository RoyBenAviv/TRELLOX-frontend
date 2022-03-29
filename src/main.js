import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/styles.scss'
import 'v-calendar/dist/style.css';
import { focusDirective, clickOutside } from './directives'
import { SetupCalendar } from 'v-calendar';
const app = createApp(App)

app.directive('focus', focusDirective)
app.directive('click-outside', clickOutside)

app.use(SetupCalendar, {})
app.use(router)
app.use(store)
app.mount('#app')
