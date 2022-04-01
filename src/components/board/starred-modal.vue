<template>
  <custom-modal class="header-modal">
    <template v-slot:header> Starred boards </template>
    <ul v-if="starredBoards.length">
      <li v-for="board in starredBoards" :key="board._id" @click="this.$router.push('/board/' + board._id)">
        <section class="bg" :style="{ 'background-image': 'url(' + board.style.bgImgUrl + ')', 'background-color': board.style.bgColor }"></section>
        <div>
          {{ board.title }}
          <span class="star" :class="{ full: board.isStarred }" @click.stop="toggleStar(board)"></span>
        </div>
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
    return {}
  },
  components: {
    customModal,
  },
  methods: {
    toggleStar(board) {
      this.$emit('toggleStar', board)
    },
  },
  computed: {
    starredBoards() {
      var boards = this.$store.getters.boards
      return boards.filter((b) => b.isStarred)
    },
  },
}
</script>

<style></style>