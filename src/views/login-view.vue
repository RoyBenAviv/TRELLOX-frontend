<template>
  <section class="login-view">
    <div @click="this.$router.push('/')" class="logo">
      <span><i class="fa-brands fa-trello"></i></span>
      <h2>Trellox</h2>
    </div>
    <div class="login-container">
      <Transition name="failed">
        <div class="failed" v-if="failed">
          <p>Logged in failed. Please enter valid email or password.</p>
        </div>
      </Transition>
      <h3>Log in to Trellox</h3>
      <form @keyup.enter="login" @submit.prevent="login" class="user-crad">
        <input type="email" v-model="loginCred.email" placeholder="Enter email" />
        <input type="password" v-model="loginCred.password" placeholder="Enter password" />
      </form>

      <button @click="login" class="login-btn">Log in</button>
      <span class="or">OR</span>
      <div class="google" @click="googleSignup">
        <img src="https://res.cloudinary.com/trellox/image/upload/v1648921835/google_pxddpi.svg" />
        <h3>Continue with Google</h3>
      </div>
      <hr />
      <router-link to="/signup">Sign up for an account</router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: 'login-view',
  data() {
    return {
      failed: false,
      loginCred: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    async login() {
      if (!this.loginCred.email || !this.loginCred.password) this.failedLog()
      try {
        await this.$store.dispatch({ type: 'login', userCred: this.loginCred })
        this.$router.push('/workspace')
      } catch (err) {
        this.failedLog()
      }
    },
    failedLog() {
      this.failed = true
      setTimeout(() => {
        this.failed = false
      }, 6000)
      return
    },
    async googleSignup() {
      try {
        const googleUser = await this.$gAuth.signIn()
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
        this.$router.push('/workspace')
      } catch (err) {
        console.log(err)
      }
    },
  },
  computed: {},
  components: {},
}
</script>

<style></style>
