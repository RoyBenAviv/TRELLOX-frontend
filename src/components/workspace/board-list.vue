<template>
  <section class="boards-area">
    <div class="boards-name">
      <span class="icon"></span>
      <h3 class="title">
        <slot name="boards-name"></slot>
      </h3>
    </div>

    <section class="board-list">
      <ul class="boards">
        <li v-for="board in boards" :key="board._id">
          <board-preview :board="board" />
        </li>
        <li v-if="showCreate" @click="openCreateBoard($event)">
          <section class="board-preview new-board">
            <div class="board-preview-container">
              <span class="txt-on-borad-img">Create new board</span>
            </div>
          </section>
        </li>
      </ul>
      <board-add v-if="openBoardCreation" @closeModal="openBoardCreation = false" :style="`top: ${posTop}px; left: ${posLeft}px`" />
    </section>
  </section>
</template>

<script>
import boardPreview from './board-preview.vue'
import boardAdd from './board-add.vue'

export default {
  name: 'board-list',
  props: {
    boards: Array,
    showCreate: Boolean,
  },
  data() {
    return {
      openBoardCreation: false,
      posLeft: null,
      posTop: null,
    }
  },
  components: {
    boardPreview,
    boardAdd,
  },
  methods: {
    openCreateBoard(ev) {
      this.calcPosition(ev.target.getBoundingClientRect())
      this.openBoardCreation = true
    },
    calcPosition(rect) {
      var { left, top } = rect
      const winWidth = window.innerWidth
      if (winWidth - left < 500) {
        this.posLeft = left - 320
      } else this.posLeft = left + 160
      this.posTop = top - 350
    },
  },
  computed: {},
}
</script>
