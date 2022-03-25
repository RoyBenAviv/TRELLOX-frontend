<template>
  <custom-modal class="board-add"  @closeModal="closeModal">
    <template v-slot:header> Create board </template>
    <div  :style="{ 'background':  newBoard.style.bgImgUrl ? 'url(' + newBoard.style.bgImgUrl + ')' : newBoard.style.bgColor}" class="demo-board" >
            <img src="src/assets//images/demo-board.svg" alt="demo board"/>
    </div>
    <div class="background-picker">
        <h4 >Background</h4>
        <ul class="image-picker">
            <li @click="setBg(image)" v-for="image in imagePicker" :key="image">
                <img :src="image" alt="board background image">
            </li>

        </ul>
        <ul class="color-picker">
            <li @click="setColor(color)" v-for="color in colorPicker" :key="color">
                <div class="color" :style="{'background-color': color}"></div>
            </li>
        </ul>
        <h4 class="board-title">Board title <span>*</span></h4>
        <input v-model="newBoard.title" type="text" placeholder="Add board title">
        <button @click="createBoard">Create</button>
    </div>
  </custom-modal>
</template>
 
<script>
 import customModal from '../board/custom-modal.vue'
 import { boardService } from '../../services/board.service-local';
export default {
 
name: '',
 data() {
return {
    newBoard: boardService.getEmptyBoard(),
    imagePicker: this.$store.getters.imagePicker,
    colorPicker: this.$store.getters.colorPicker
};
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

        await this.$store.dispatch({type: 'saveBoard', board: this.newBoard})
        this.$router.push(`/board/${this.newBoard._id}`)
        this.newBoard = boardService.getEmptyBoard()
    },
},
created() { 
},
computed: {
},
components: {
    customModal,
    boardService
}
};
</script>
 
<style>
 
</style>