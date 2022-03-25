<template>
  <custom-modal class="board-add"  @closeModal="closeModal">
    <template v-slot:header> Create board </template>
    <div  :style="{ 'background-image': 'url(' + newBoard.style.bgImgUrl + ')', 'background-color': newBoard.style.bgColor}" class="demo-board" >
            <img src="src/assets//images/demo-board.svg" alt="demo board"/>
    </div>
    <div class="background-picker">
        <h4>Background</h4>
        <ul class="image-picker">
            <li @click="setBg(image)" v-for="image in imagePicker" :key="image">
                <img :src="image" alt="board background image">
            </li>

        </ul>
        <ul class="color-picker">
            <li>
                <div></div>
            </li>
        </ul>
        <h4>Board title <span>*</span></h4>
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
    imagePicker: [
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?crop=entropy&cs=srgb&fm=jpg&ixid=MnwzMTI4NzN8MHwxfHNlYXJjaHw0fHxtb3VudGFpbnxlbnwwfHx8fDE2NDgyMjMxMjg&ixlib=rb-1.2.1&q=85',
    'https://images.unsplash.com/photo-1480497490787-505ec076689f?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?crop=entropy&cs=srgb&fm=jpg&ixid=MnwzMTI4NzN8MHwxfHNlYXJjaHwzfHxtb3VudGFpbnxlbnwwfHx8fDE2NDgyMjMxMjg&ixlib=rb-1.2.1&q=85',
    'https://images.unsplash.com/photo-1433477155337-9aea4e790195?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb'

    ]
};
 },
methods: {
    closeModal() {
        this.$emit('closeModal')
    },
    setBg(image) {
        this.newBoard.style.bgImgUrl = image
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