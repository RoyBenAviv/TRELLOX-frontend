import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/styles.scss'
import 'v-calendar/dist/style.css';
import { focusDirective, clickOutside } from './directives'
import { SetupCalendar } from 'v-calendar';
import gAuthPlugin from 'vue3-google-oauth2'
let gauthClientId = '438420074378-5cu9up50dsabv90v8ak9p72vrmfgdaod.apps.googleusercontent.com'

import { registerSW } from 'virtual:pwa-register'




const app = createApp(App)

app.directive('focus', focusDirective)
app.directive('click-outside', clickOutside)
registerSW({ immediate: true })

app.use(gAuthPlugin, {
    clientId: gauthClientId,
    scope: 'email',
    prompt: 'consent'
})
app.use(SetupCalendar, {})
app.use(router)
app.use(store)
app.mount('#app')
