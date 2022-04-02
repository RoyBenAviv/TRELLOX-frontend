<template>
  <router-view />
</template>

<script>

export default {
  created() {
    this.$store.dispatch('loadBoards')
    this.$store.dispatch('loadUsers')
  },
  components: {
  },
}
</script>