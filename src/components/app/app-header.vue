<template>
  <header>
    <div class="logo"> <img src="https://res.cloudinary.com/trellox/image/upload/v1648060627/logo_jlbrpj.png" /> <h2>Trellox</h2></div>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/login">login</router-link>
        <router-link to="/workspace">workspace</router-link>
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
