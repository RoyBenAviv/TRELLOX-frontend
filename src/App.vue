<template>
  <app-header />
  <router-view />
</template>

<script>
import appHeader from './components/app-header.vue'
export default {
  created() {
    this.$store.dispatch('loadBoards')
  },
  components: {
    appHeader,
  },
}
</script>
