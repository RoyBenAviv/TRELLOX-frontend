<template>
  <header>
    <div class="logo"> <img src="../assets/images/logo.png" /> <h2>Trellox</h2></div>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/login">login</router-link>
        <router-link to="/workspace">workspace</router-link>
        <router-link to="/board">board</router-link>
      </nav>
  </header>
</template>

<script>
export default {
  name: 'app header',
  data() {
    return {}
  },
  methods: {},
  computed: {},
  components: {},
}
</script>

<style></style>
