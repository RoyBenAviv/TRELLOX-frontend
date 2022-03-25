<template>
  <section class="group-preview">
    <div>
      <div class="group-header-container">
        <p class="group-title" v-if="!editTitle" @click="editTitle = true">{{ group.title }}</p>
        <textarea v-if="editTitle" v-model="group.title"></textarea>
        <span class="act-btn" @click="openGrpAct = !openGrpAct"><i class="fa-solid fa-ellipsis"></i></span>
        <group-actions @archiveCards="archiveCards" @moveAllCards="moveAllCards" @moveGroup="moveGroup" @copyGroup="copyGroup" @archiveGroup="archiveGroup" @addCard="actionAdd" v-if="openGrpAct" />
      </div>
      <!-- <div class="card-preview-container"> -->

      <Container class="card-preview-container" @drop="onCardDrop($event)">
        <Draggable v-for="card in group.cards" :key="card.id">
          <card-preview :card="card" />
        </Draggable>

        <div class="open-card-container" @click="isAddCard = true" v-if="!isAddCard"><i class="fa-solid fa-plus"></i><span>Add a card</span></div>
        <div class="add-card-container" v-else>
          <textarea @keyup.enter="addCard" autofocus class="add-card-textarea" v-model="cardTitle" placeholder="Enter a title for this card..."></textarea>
          <div class="add-card-actions">
            <button @click="addCard">Add card</button><span @click="isAddCard = false"><i class="fa-solid fa-xmark"></i></span>
          </div>
        </div>
      </Container>
    </div>
    <!-- </div> -->
  </section>
</template>

<script>
import cardPreview from './card-preview.vue'
import groupActions from './group-actions.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../../services/drag.helpers'
import { utilService } from '../../services/util.service'

export default {
  name: 'group',
  props: {
    group: Object,
  },
  components: {
    cardPreview,
    groupActions,
    Container,
    Draggable,
  },
  created() {},
  data() {
    return {
      isAddCard: false,
      cardTitle: '',
      editTitle: false,
      openGrpAct: false,
    }
  },
  methods: {
    addCard() {
      this.$store.dispatch({ type: 'addCard', groupId: this.group.id, title: this.cardTitle })
      this.cardTitle = ''
    },
    actionAdd() {
      this.isAddCard = true
      this.openGrpAct = false
    },
    archiveGroup() {
      this.$store.dispatch({ type: 'archiveGroup', groupId: this.group.id })
      this.openGrpAct = false
    },
    archiveCard(cardId) {
      this.$store.dispatch({ type: 'archiveCard', groupId: this.group.id, cardId })
    },
    async onCardDrop(dropResult) {
      const group = Object.assign({}, JSON.parse(JSON.stringify(this.group)))
      group.cards = applyDrag(group.cards, dropResult)

      this.$emit('onCardDrop', { cards: group.cards, groupId: group.id })
    },
    copyGroup(title) {
      this.openGrpAct = false
      const groupIdx = this.board.groups.findIndex(group => group.id === this.group.id)

      const newGroup = JSON.parse(JSON.stringify(this.group))
      newGroup.title = title
      newGroup.id = utilService.makeId

      this.board.groups.splice(groupIdx + 1, 0, newGroup)
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
    },
    async moveGroup(moveToBoard, groupPos) {

      moveToBoard.groups.splice(groupPos, 0, JSON.parse(JSON.stringify(this.group)))
      await this.$store.dispatch({ type: 'saveBoard', board: moveToBoard })

      const groupIdx = this.board.groups.findIndex(group => group.id === this.group.id)
      this.board.groups.splice(groupIdx, 1)
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
    },
    moveAllCards(chosenGroup) {
      
        const groupCards = JSON.parse(JSON.stringify(this.group.cards))
        chosenGroup.cards.push(...groupCards)
        // this.group.cards = []
        const groupIdx = this.board.groups.findIndex(group => group.id === chosenGroup.id)
        this.board.groups.splice(groupIdx, 1, chosenGroup)
        this.$store.dispatch({ type: 'saveBoard', board: this.board })
    },
    archiveCards() {
      this.group.cards = []
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
    }
  },
  computed: {
    board() {
      return this.$store.getters.currBoard
    } 
  },
}
</script>
