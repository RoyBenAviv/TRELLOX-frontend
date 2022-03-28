<template>
  <section class="signup-view">
    <div class="logo">
      <span><i class="fa-brands fa-trello"></i></span>
      <h2>Trellox</h2>
    </div>
    <div class="login-container">
      <h3>Log in to Trello</h3>
      <form @submit.prevent="signup" class="user-crad">
        <input v-focus type="text" v-model="signupCred.fullname" placeholder="Enter fullname" />
        <input type="email" v-model="signupCred.email" placeholder="Enter email" />
        <input type="password" v-model="signupCred.password" placeholder="Enter password" />
      </form>

      <button @click="signup" class="login-btn">Sign up!</button>
      <hr />
      <router-link to="/login">Already have an acount? Log in</router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: '',
  data() {
    return {
        signupCred: {email: '', username: '', password: '', fullname: ''},
    }
  },
  methods: {
    async signup() {
      try {
        this.signupCred.username = this.signupCred.fullname.split(" ").join("").toLowerCase()
        await this.$store.dispatch({ type: 'signup', userCred: this.signupCred })
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
