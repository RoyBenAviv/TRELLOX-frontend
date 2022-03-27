<template>
  <router-view />
</template>

<script>
export default {
  created() {
    this.$store.dispatch('loadBoards')
  },
  components: {
  },
}
</script>
