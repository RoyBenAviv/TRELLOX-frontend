<template>
  <custom-modal class="starred-modal">
    <template v-slot:header> Starred boards </template>
    <ul v-if="starredBoards.length">
      <li v-for="board in starredBoards" :key="board._id">
        {{ board.title }}
      </li>
    </ul>
    <div v-else class="starred-container">
      <img src="https://a.trellocdn.com/prgb/dist/images/starred-boards-menu/starred-board.cc47d0a8c646581ccd08.svg" />
      <p>Star important boards to access them quickly and easily.</p>
    </div>
    <!-- {{ starredBoards }} -->
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
export default {
  name: '',
  data() {
    return {
      starredBoards: this.starBoards(),
    }
  },
  components: {
    customModal,
  },
  methods: {
    async starBoards() {
      this.starredBoards = await this.$store.dispatch({ type: 'getBoards', filterBy: { isStarred: true } })
    },
  },
  computed: {},
}
</script>

<style></style>
