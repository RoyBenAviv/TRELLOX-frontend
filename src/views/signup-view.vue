<template>
  <section class="signup-view">
    <div @click="this.$router.push('/')" class="logo">
      <span><i class="fa-brands fa-trello"></i></span>
      <h2>Trellox</h2>
    </div>
    <div class="login-container">
      <Transition name="failed">
        <div class="failed" v-if="failed">
          <p>Sign up failed. Please enter valid email or password.</p>
        </div>
      </Transition>
      <h3>Sign up to Trellox</h3>
      <form @keyup.enter="signup" @submit.prevent="signup" class="user-crad">
        <input v-focus type="text" v-model="signupCred.fullname" placeholder="Enter fullname" />
        <input type="email" v-model="signupCred.email" placeholder="Enter email" />
        <input type="password" v-model="signupCred.password" placeholder="Enter password" />
      </form>

      <button @click="signup" class="login-btn">Sign up!</button>
      <span>OR</span>
      <button @click="googleSignup">Continue with Google</button>
      <button @click="useAuthProvider('facebook', Faceebook)">oAuth Facebook M2</button>

      <hr />
      <router-link to="/login">Already have an acount? Log in</router-link>
    </div>
  </section>
</template>

<script>

import { Facebook } from 'universal-social-auth'
import { Providers} from 'universal-social-auth'

export default {
  name: '',
  data() {
    return {
      failed: false,
      signupCred: { email: '', username: '', password: '', fullname: '', boardIds: [], imgUrl: null },
      Facebook
    }
  },
  methods: {
    async signup() {
      if (!this.signupCred.email || !this.signupCred.password || !this.signupCred.fullname) this.failedLog()
      if (this.signupCred.fullname.split(' ').length <= 1) return
      try {
        const nameArray = this.signupCred.fullname.split(' ')
        this.signupCred.fullname = nameArray.reduce((name, word) => name + ' ' + this.capitalizeFirstLetter(word), '')
        this.signupCred.fullname = this.signupCred.fullname.trim()
        console.log('this.signupCred.fullname', this.signupCred.fullname)
        this.signupCred.username = this.signupCred.fullname.split(' ').join('').toLowerCase()
        await this.$store.dispatch({ type: 'signup', userCred: this.signupCred })
        console.log('this.signupCred', this.signupCred)
        this.$router.push('/workspace')
      } catch (err) {
        // this.failedLog()
        console.log('error')
      }
    },
    async googleSignup() {
      try {
        const googleUser = await this.$gAuth.signIn()
        console.log(googleUser)
        if (!googleUser) return

        this.googleUser = {
          email: googleUser.Du.tv,
          fullname: googleUser.Du.tf,
          username: googleUser.Du.tf.split(' ').join('').toLowerCase(),
          password: 'google',
          boardIds: [],
          imgUrl: googleUser.Du.eN,
        }

        await this.$store.dispatch({ type: 'signup', userCred: JSON.parse(JSON.stringify(this.googleUser)) })
        console.log('googleUser', JSON.parse(JSON.stringify(this.googleUser)))
        this.$router.push('/workspace')
      } catch (err) {
        console.log(err)
      }
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    failedLog() {
      this.failed = true
      setTimeout(() => {
        this.failed = false
      }, 6000)
      return
    },

        useAuthProvider (provider, proData) {
          console.log('hi1')
      const pro = proData
      const ProData = pro || Providers[provider]
      this.$Oauth.authenticate(provider, ProData).then((response) => {
        const rsp = response
        if (rsp.code) {
          this.responseData.code = rsp.code
          this.responseData.provider = provider
          this.useSocialLogin()
          console.log('hi1')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    async useSocialLogin () {
      console.log('hi')
      // otp from input Otp form
      // hash user data in your backend with Cache or save to database
      const pdata = { code: this.responseData.code, otp: this.data.tok, hash: this.hash }
      this.$axios.post('https://api.diadal.com.ng/social-login/' + this.responseData.provider, pdata).then(async (response) => {
          // `response` data base on your backend config
        if (response.data.status === 444) {
          this.hash = response.data.hash
          this.fauth = true // Option show Otp form incase you using 2fa or any addition security apply to your app you can handle all that from here
        }else if (response.data.status === 445) {
          //do something Optional
          console.log('hi1')
        }else {
          console.log('hi2')
          await this.useLoginFirst(response.data.u)
        }
      }).catch((err) => {
        console.log(err)
      })
    },



  },
  computed: {},
  components: {},
}
</script>

<style></style>
