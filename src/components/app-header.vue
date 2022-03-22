<template>
  <header>
    <section>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/login">login</router-link>
        <router-link to="/workspace">workspace</router-link>
        <router-link to="/board">board</router-link>
        <i class="fa-solid fa-list"></i>
      </nav>
    </section>
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
