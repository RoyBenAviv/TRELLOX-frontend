<template>
  <section class="board-preview">
    <router-link :to="'/board/' + board._id">
      <div :style="{ 'background-image': linearGradient() + 'url(' + board.style.bgImgUrl + ')',
       'background-color': board.style.bgColor }"
        class="board-preview-container"></div>
      <span :class="board.style.bgImgUrl ? 'shadow-text' : ''" class="txt-on-borad-img">{{ board.title }} </span>
    </router-link>
    <span class="star" :class="{ full: board.isStarred }" @click="toggleStar()"></span>
  </section>
</template>

<script>
import FastAverageColor from 'fast-average-color'

export default {
  name: 'board-preview',
  props: {
    board: Object,
  },
  data() {
    return {
      color: null,
    }
  },
  async created() {
    try {
      if (this.board.style.bgImgUrl) {
        const fac = new FastAverageColor()
        this.color = await fac.getColorAsync(this.board.style.bgImgUrl)
      }
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    linearGradient() {
      var num
      if (this.color) num = this.color.isDark ? '0.1' : '0.35'
      else num = '0.1'
      return `linear-gradient(rgba(0, 0, 0, ${num}),rgba(0, 0, 0, ${num})), `
    },
    async toggleStar() {
      const board = JSON.parse(JSON.stringify(this.board))
      board.isStarred = !board.isStarred
      await this.$store.dispatch({ type: 'saveBoard', board })
    },
  },
  computed: {},
  components: {},
}
</script>
