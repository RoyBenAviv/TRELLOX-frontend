<template>
  <custom-modal class="search-modal-container">
    <section class="search-modal">
      <div class="title">Recent boards</div>
      <ul v-if="boards.length">
        <li v-for="board in boards" :key="board._id" @click="setCurrBoard(board._id)">
          <span class="star" :class="{ full: board.isStarred }" @click.stop="toggleStar(board)"></span>
          <section class="bg" :style="{ 'background-image': 'url(' + board.style.bgImgUrl + ')', 'background-color': board.style.bgColor }"></section>
          <div class="name">
            {{ board.title }}
          </div>
        </li>
      </ul>
      <div v-else class="not-found">We couldn't find any boards that matched your search.</div>
    </section>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
export default {
  name: '',
  props: {
    boards: Array,
  },
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
    async setCurrBoard(boardId) {
      await this.$store.dispatch({ type: 'setCurrBoard', boardId })
      this.$router.push('/board/' + boardId)
    },
  },
  computed: {},
}
</script>
