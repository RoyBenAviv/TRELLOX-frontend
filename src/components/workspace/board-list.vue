<template>
  <div class="boards-name">
    <span class="icon"></span>
    <slot name="boards-name" class="title"></slot>
  </div>

  <section class="board-list">
    <ul class="boards">
      <li v-for="board in boards" :key="board._id">
        <board-preview :board="board" />
      </li>
      <li style="position: relative" @click="openBoardCreation = true">
        <div class="create-board">
          <span>Create new board</span>
        </div>
        <board-add @closeModal="openBoardCreation = false" v-if="openBoardCreation" />
      </li>
    </ul>
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

<style></style>
