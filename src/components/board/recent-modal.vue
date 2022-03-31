<template>
  <custom-modal class="header-modal">
    <template v-slot:header> Recent boards </template>
    <ul>
      <li v-for="board in boards" :key="board._id" @click="this.$router.push('/board/' + board._id)">
        <section class="bg" :style="{ 'background-image': 'url(' + board.style.bgImgUrl + ')', 'background-color': board.style.bgColor }"></section>
        <div>
          {{ board.title }}
          <span class="star" :class="{ full: board.isStarred }" @click.stop="toggleStar(board)"></span>
        </div>
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
  methods: {
    toggleStar(board) {
      this.$emit('toggleStar', board)
    },
  },
  computed: {
    boards() {
      return this.$store.getters.boards
    },
  },
}
</script>

<style></style>
