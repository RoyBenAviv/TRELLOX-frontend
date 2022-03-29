<template>
  <custom-modal class="starred-modal">
    <template v-slot:header> Starred boards </template>
    <div class="starred-container">
      <img src="https://a.trellocdn.com/prgb/dist/images/starred-boards-menu/starred-board.cc47d0a8c646581ccd08.svg" />
      <p>Star important boards to access them quickly and easily.</p>
    </div>
    {{ starredBoards }}
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
export default {
  name: '',
  data() {
    return {
      starredBoards: this.checkStarred,
    }
  },
  methods: {},
  computed: {
    boards() {
      return this.$store.getters.boards
    },
    checkStarred() {
      return this.boards.filter((board) => {
        board.isStarred === false
      })
    },
  },
  components: {
    customModal,
  },
}
</script>

<style></style>
