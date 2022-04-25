<template>
  <section class="group-preview">
    <div>
      <div class="group-header-container">
        <p class="group-title" v-if="!editTitle" @click="editTitle = true">{{ group.title }}</p>
        <input @keyup.enter="changeGrpTitle" v-click-outside="changeGrpTitle" v-focus @focus="$event.target.select()" v-if="editTitle" v-model="groupTitle" />
        <span class="act-btn" @click="toggleGroupActions($event)"></span>
        <group-actions
          v-if="openGrpAct"
          :isSort="group.cards.length > 1 ? true : false"
          @closeGrpAct="openGrpAct = false"
          v-click-outside="() => (openGrpAct = false)"
          @removeCards="removeCards"
          @moveAllCards="moveAllCards"
          @moveGroup="moveGroup"
          @copyGroup="copyGroup"
          @removeGroup="removeGroup"
          @addCard="actionAdd"
          @sortBy="sortCards"
          :style="`left: ${posLeft}px`"
        />
      </div>

      <Container drag-class="on-dragging" class="card-preview-container" @drop="onCardDrop(group, $event)" group-name="1" :get-child-payload="getChildPayload">
        <Draggable v-for="card in group.cards" :key="card.id">
          <card-preview v-if="card.isShown" @openQuickEdit="openQuickEdit" @closeQuickEdit="closeQuickEdit" :groupId="group.id" :isQuickEdit="isQuickEdit" :cardToCopy="card" />
          <!-- {{ card.title }} {{ card.isShown }} -->
        </Draggable>

        <div class="add-card-container" v-if="isAddCard">
          <textarea v-click-outside="() => addCard()" @keydown.enter.prevent @keyup.enter="addCard" v-focus class="add-card-textarea" v-model="cardTitle" placeholder="Enter a title for this card..."></textarea>
          <div class="add-card-actions">
            <button @click="addCard">Add card</button><span @click="isAddCard = false"><i class="fa-solid fa-xmark"></i></span>
          </div>
        </div>
      </Container>
      <div class="open-card-container" @click="isAddCard = true" v-if="!isAddCard">
        <div class="add-card-btn"><i class="fa-solid fa-plus"></i><span>Add a card</span></div>
      </div>
    </div>
    <div name="quick-card-editor" v-if="isQuickEdit.boolean" @mousedown.stop @click.stop="isQuickEdit.boolean = false" :class="computedQuickEdit"></div>
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
      groupTitle: JSON.parse(JSON.stringify(this.group.title)),
      cardTitle: '',
      editTitle: false,
      openGrpAct: false,
      isQuickEdit: {
        boolean: false,
        cardId: '',
      },
      posLeft: null,
    }
  },
  methods: {
    toggleGroupActions(ev) {
      this.openGrpAct = !this.openGrpAct
    },
    addCard() {
      if (!this.cardTitle) return
      this.$store.dispatch({ type: 'addCard', groupId: this.group.id, title: this.cardTitle })
      this.cardTitle = ''
    },
    actionAdd() {
      this.isAddCard = true
      this.openGrpAct = false
    },
    removeGroup() {
      this.$store.dispatch({ type: 'removeGroup', groupId: this.group.id })
      this.openGrpAct = false
    },
    removeCard(cardId) {
      this.$store.dispatch({ type: 'removeCard', groupId: this.group.id, cardId })
    },
    onCardDrop(group, dropResult) {
      const newGroup = Object.assign({}, JSON.parse(JSON.stringify(group)))
      newGroup.cards = applyDrag(newGroup.cards, dropResult)
      this.$emit('onCardDrop', { cards: newGroup.cards, groupId: newGroup.id })
    },
    copyGroup(title) {
      this.openGrpAct = false
      const groupIdx = this.board.groups.findIndex((group) => group.id === this.group.id)

      const newGroup = JSON.parse(JSON.stringify(this.group))
      newGroup.title = title
      newGroup.id = utilService.makeId

      this.board.groups.splice(groupIdx + 1, 0, newGroup)
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
    },
    async moveGroup(moveToBoard, groupPos) {
      this.openGrpAct = false
      moveToBoard.groups.splice(groupPos, 0, JSON.parse(JSON.stringify(this.group)))
      await this.$store.dispatch({ type: 'saveBoard', board: moveToBoard })

      const groupIdx = this.board.groups.findIndex((group) => group.id === this.group.id)
      this.board.groups.splice(groupIdx, 1)
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
    },
    moveAllCards(chosenGroup) {
      this.openGrpAct = false
      const currGroup = JSON.parse(JSON.stringify(this.group))

      const groupCards = JSON.parse(JSON.stringify(this.group.cards))
      chosenGroup.cards.push(...groupCards)
      currGroup.cards = []

      const currGroupIdx = this.board.groups.findIndex((group) => group.id === currGroup.id)
      this.board.groups.splice(currGroupIdx, 1, currGroup)

      const chosenGroupIdx = this.board.groups.findIndex((group) => group.id === chosenGroup.id)
      this.board.groups.splice(chosenGroupIdx, 1, chosenGroup)
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
    },
    removeCards() {
      const group = JSON.parse(JSON.stringify(this.group))
      group.cards = []
      const idx = this.board.groups.findIndex((g) => g.id === this.group.id)
      this.board.groups[idx] = group
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
    },
    closeQuickEdit() {
      this.isQuickEdit.boolean = false
      this.isQuickEdit.cardId = ''
    },
    openQuickEdit(cardId) {
      this.isQuickEdit.boolean = true
      this.isQuickEdit.cardId = cardId
    },
    getChildPayload(idx) {
      return this.group.cards[idx]
    },
    changeGrpTitle() {
      const group = JSON.parse(JSON.stringify(this.group))
      group.title = this.groupTitle
      const groupIdx = this.board.groups.findIndex((group) => group.id === this.group.id)
      this.board.groups.splice(groupIdx, 1, group)
      this.$store.dispatch({ type: 'saveBoard', board: this.board })
      this.editTitle = false
    },
    sortCards(value) {
      this.openGrpAct = false
      var filterBy = {
        type: 'sort',
        groupId: this.group.id,
        sortBy: value,
      }
      this.$store.dispatch({ type: 'filterBoard', boardId: this.board._id, filterBy })
    },
  },
  computed: {
    board() {
      return this.$store.getters.currBoard
    },
    computedQuickEdit() {
      return this.isQuickEdit.boolean ? 'quick-card-editor' : ''
    },
  },
}
</script>
<style scoped>
.on-dragging {
  transform: rotate(5deg);
}
</style>
