<template>
  <section class="signup-view">
    <div class="logo">
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
      <hr />
      <router-link to="/login">Already have an acount? Log in</router-link>
    </div>
    {{signupCred}}
  </section>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      failed: false,
      signupCred: { email: '', username: '', password: '', fullname: '' },
    }
  },
  methods: {
    async signup() {
      if(!this.signupCred.email || !this.signupCred.password || !this.signupCred.fullname) this.failedLog()
      if (this.signupCred.fullname.split(" ").length <= 1) return
      try {
        this.signupCred.username = this.signupCred.fullname.split(' ').join('').toLowerCase()
        await this.$store.dispatch({ type: 'signup', userCred: this.signupCred })
        this.$router.push('/workspace')
      } catch (err) {
        // this.failedLog()
        console.log('error')
      }
    },
    failedLog() {
      this.failed = true
      setTimeout(() => {
        this.failed = false
      }, 6000)
      return
    },
  },
  computed: {},
  components: {},
}
</script>

<style></style>
