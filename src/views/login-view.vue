<template>
  <section class="login-view">
    <div class="logo">
      <span><i class="fa-brands fa-trello"></i></span>
      <h2>Trellox</h2>
    </div>
    <div class="login-container">
      <h3>Log in to Trello</h3>
      <form @submit.prevent="login" class="user-crad">
        <input v-focus type="email" v-model="loginCred.email" placeholder="Enter email" />
        <input type="password" v-model="loginCred.password" placeholder="Enter password" />
      </form>

      <button @click="login" class="login-btn">Log in</button>
        <hr>
        <router-link to="/signup">Sign up for an account</router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: 'login-view',
  data() {
    return {
      loginCred: {
        email: '',
        password: ''
      },
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch({ type: 'login', userCred: this.loginCred})
        this.$router.push('/workspace');
      } catch {
          console.log(err)
      }

    }
  },
  computed: {},
  components: {},
}
</script>

<style></style>
