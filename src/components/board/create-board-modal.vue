<template>
  <custom-modal @closeModal="closeModal" v-if="!openBoardCreation" class="create-board-modal">
    <template v-slot:header> Create </template>
    <template v-slot:main>
      <ul>
        <li @click.stop="openBoardCreation = true" class="create">
          <h3>Create Board</h3>
          <p>A board is made up of cards ordered on lists. Use it to manage projects, track information, or organize anything.</p>
        </li>
        <li class="template">
          <h3>Start with a template</h3>
          <p>Get started with a board template</p>
        </li>
      </ul>
    </template>
  </custom-modal>

  <custom-modal @closeModal="closeModal" v-if="openBoardCreation" class="create-board-modal board-add">
    <template v-slot:header> Create board </template>
    <div :style="{ 'background-image': 'url(' + newBoard.style.bgImgUrl + ')', 'background-color': newBoard.style.bgColor }" class="demo-board">
      <img src="https://res.cloudinary.com/trellox/image/upload/v1648370075/demo-board_kga9ov.svg" alt="demo board" />
    </div>
    <div class="background-picker">
      <h4>Background</h4>
      <ul class="image-picker">
        <li @click="setBg(image)" v-for="image in imagePicker" :key="image">
          <img :src="image" alt="board background image" />
        </li>
      </ul>
      <ul class="color-picker">
        <li @click="setColor(color)" v-for="color in colorPicker" :key="color">
          <div class="color" :style="{ 'background-color': color }"></div>
        </li>
      </ul>
      <h4 class="board-title">Board title <span>*</span></h4>
      <input v-model="newBoard.title" type="text" placeholder="Add board title" />
      <button @click="createBoard">Create</button>
    </div>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'
import { localService } from '../../services/board.service-local'
export default {
  name: '',
  data() {
    return {
      openBoardCreation: false,
      newBoard: localService.getEmptyBoard(),
      imagePicker: this.$store.getters.imagePicker,
      colorPicker: this.$store.getters.boardColors.slice(0, 5),
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    setBg(image) {
      this.newBoard.style.bgColor = ''
      this.newBoard.style.bgImgUrl = image
    },
    setColor(color) {
      this.newBoard.style.bgImgUrl = ''
      this.newBoard.style.bgColor = color
    },
    async createBoard() {
      await this.$store.dispatch({ type: 'saveBoard', board: this.newBoard })
      this.$router.push(`/board/${this.$store.getters.currBoard._id}`)
      this.newBoard = localService.getEmptyBoard()
    },
  },
  computed: {},
  components: {
    customModal,
  },
}
</script>

<style></style>
