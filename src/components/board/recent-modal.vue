<template>
  <custom-modal class="recent-modal">
    <template v-slot:header> Recent boards </template>
    <ul>
      <li v-for="board in boards" :key="board._id">
        {{ board.title }}
      </li>
    </ul>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
export default {
  name: '',
  data() {
    return {}
  },
  components: {
    customModal,
  },
  methods: {},
  computed: {
    boards() {
      return this.$store.getters.boards
    },
  },
}
</script>

<style></style>
