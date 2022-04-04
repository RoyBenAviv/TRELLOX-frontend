<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header>{{isCopyCard ? 'Copy' : 'Move'}} card </template>
    <div v-if="isCopyCard">
      <h4>Title</h4>
      <textarea type="text" v-model="newTitle" class="custom-input"/>
    </div>
    <h4>{{isCopyCard ? 'Copy to...' : 'Select destination'}}</h4>
    <div class="move-card">
      <form @submit.prevent="moveCard">
        <label>
          <div class="board-info">
            <p>Board</p>
            <p>{{ chosenBoard.title }}</p>
            <select v-model="chosenBoard">
              <option v-for="board in boards" :key="board._id" :value="board">{{ board.title }}</option>
            </select>
          </div>
        </label>
        <label>
          <div class="board-info">
            <p>Group</p>
            <p>{{ chosenBoard.groups[groupPos].title }}</p>
            <select v-model="groupPos">
              <option v-for="(group, idx) in chosenBoard.groups" :key="group" :value="idx">{{ group.title }}</option>
            </select>
          </div>
        </label>
        <label>
          <div class="board-info">
            <p>Position</p>
            <p>{{ cardPos + 1 }}</p>
            <select v-if="chosenBoard.groups[groupPos].cards.length" v-model="cardPos">
              <option v-for="(card, idx) in chosenBoard.groups[groupPos].cards" :key="card.id" :value="idx">{{ idx + 1 }}</option>
            </select>
          </div>
        </label>
        <button @click="moveCard">{{isCopyCard ? 'Copy' : 'Move'}}</button>
      </form>
    </div>
  </custom-modal>
</template>

<script>
import { utilService } from '../../services/util.service'
import customModal from './custom-modal.vue'
export default {
  props: {
    card: Object,
    isCopyCard: Boolean
  },
  data() {
    return {
      chosenBoard: this.$store.getters.currBoard,
      groupPos: 0,
      cardPos: 0,
      newTitle: JSON.parse(JSON.stringify(this.card.title)),
      currBoard: null
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    async moveCard() {
      this.currBoard = JSON.parse(JSON.stringify(this.$store.getters.currBoard))
      const board = JSON.parse(JSON.stringify(this.chosenBoard))
      var card = JSON.parse(JSON.stringify(this.card))
      if (this.isCopyCard){
        card.title = this.newTitle
        card.id = utilService.makeId()
      } 
      board.groups[this.groupPos].cards.splice(this.cardPos, 0, card)
      await this.$store.dispatch({type: 'saveBoard', board})
      await this.$store.dispatch({type: 'setCurrBoard', boardId: this.currBoard._id})
      if (!this.isCopyCard) this.$emit('removeCard')
      this.closeModal()
    },
  },
  computed: {
      boards() {
      return this.$store.getters.boards
    },
  },
  components: {
    customModal,
  },
}
</script>

<style></style>
