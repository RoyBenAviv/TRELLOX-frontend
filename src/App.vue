<template>
  <router-view />
</template>

<script>
import { socketService } from "./services/socket.service.js"

export default {
  methods: {
    test() {
      console.log('hi')
    }
  },
  created() {
    this.$store.dispatch('loadBoards')
    socketService.on('test', this.test)
  },
  components: {
  },
}
</script>
