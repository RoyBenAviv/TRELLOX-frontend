<template>
  <section class="board-preview">
    <router-link :to="'/board/' + board._id">
      <div :style="{ 'background-image': linearGradient() + 'url(' + board.style.bgImgUrl + ')', 'background-color': board.style.bgColor }" class="board-preview-container"></div>
      <!-- <div> -->
      <span class="txt-on-borad-img">{{ board.title }}

      </span>
      <!-- </div> -->
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
      console.log('this.color', this.color)
      console.log('this.color.isDark', this.color.isDark)
      // this.linearGradient()
      // color = color.isDark ? '#fff' : '#000'
      // backgroundColor = color.rgba // hex
    } catch (err) {
      console.log(e)
    }
  },
  methods: {
    linearGradient() {
      var num
      if (this.color) {
        num = this.color.isDark ? '0.05' : '0.3'
        console.log('num', num)
        // const num = '0.1'
      } else num = '0.1'
      return `linear-gradient(rgba(0, 0, 0, ${num}),rgba(0, 0, 0, ${num})), `
    },
  },
  computed: {},
  components: {},
}
</script>

<style>
.board-preview-container:hover {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
  /* background-color: board.style.bgColor */
}
</style>
