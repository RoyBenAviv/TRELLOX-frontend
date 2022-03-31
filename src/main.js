import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/styles.scss'
import 'v-calendar/dist/style.css';
import { focusDirective, clickOutside } from './directives'
import { SetupCalendar } from 'v-calendar';
import gAuthPlugin from 'vue3-google-oauth2'
import {UniversalSocialauth} from 'universal-social-auth'
import axios from 'axios'
let gauthClientId = '438420074378-5cu9up50dsabv90v8ak9p72vrmfgdaod.apps.googleusercontent.com'

const options = {
    providers: {
      facebook: {
        clientId: '283841753934937',
        redirectUri: 'https://localhost:3000/auth/facebook/callback'
      }
  }
}





const app = createApp(App)

app.directive('focus', focusDirective)
app.directive('click-outside', clickOutside)

app.use(gAuthPlugin, {
    clientId: gauthClientId,
    scope: 'email',
    prompt: 'consent'
})

const Oauth = new UniversalSocialauth(axios, options)
app.config.globalProperties.$Oauth = Oauth

app.use(SetupCalendar, {})
app.use(router)
app.use(store)
app.mount('#app')
