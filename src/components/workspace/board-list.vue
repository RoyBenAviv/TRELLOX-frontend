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
        <li @click="openBoardCreation = true">
          <section class="board-preview new-board">
            <div class="board-preview-container"></div>
            <span class="txt-on-borad-img">Create new board</span>
          </section>
          <board-add @closeModal="openBoardCreation = false" v-if="openBoardCreation" />
        </li>
      </ul>
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
  },
  data() {
    return {
      openBoardCreation: false,
    }
  },
  methods: {},
  computed: {},
  components: {
    boardPreview,
    boardAdd,
  },
}
</script>
