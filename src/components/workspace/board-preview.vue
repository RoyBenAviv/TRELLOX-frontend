<template>
  <section class="board-preview">
    <router-link :to="'/board/' + board._id">
      <div :style="{ 'background-image': linearGradient() + 'url(' + board.style.bgImgUrl + ')', 'background-color': board.style.bgColor }" class="board-preview-container"></div>
      <span class="txt-on-borad-img">{{ board.title }} </span>
    </router-link>
    <span class="star-icon"></span>
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
      const fac = new FastAverageColor()
      this.color = await fac.getColorAsync(this.board.style.bgImgUrl)
    } catch (err) {
      console.log(e)
    }
  },
  methods: {
    linearGradient() {
      var num
      if (this.color) num = this.color.isDark ? '0.05' : '0.3'
      else num = '0.1'
      return `linear-gradient(rgba(0, 0, 0, ${num}),rgba(0, 0, 0, ${num})), `
    },
  },
  computed: {},
  components: {},
}
</script>
