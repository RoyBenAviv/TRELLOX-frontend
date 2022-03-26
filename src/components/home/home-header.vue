<template>
  <header class="home-header">
    <div class="logo"><span><i class="fa-brands fa-trello"></i></span> <h2>Trellox</h2></div>
      <nav>
        <router-link to="/login">login</router-link>
        <router-link to="/">Home</router-link>
        <!-- <router-link to="/workspace">workspace</router-link> -->
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
