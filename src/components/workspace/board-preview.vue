<template>
  <section class="board-preview">
    <router-link :to="'/board/' + board._id">
      <div :style="{ 'background-image': 'url(' + board.style.bgImgUrl + ')', 'background-color': board.style.bgColor }" class="board-preview-container">
        <span class="txt-on-borad-img">{{ board.title }}</span>
      </div>
    </router-link>
  </section>
</template>

<script>
export default {
  name: 'board-preview',
  props: {
    board: Object,
  },

  data() {
    return {}
  },
  methods: {},
  computed: {},
  components: {},
}
</script>

<style></style>
