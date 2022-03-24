<template>
  <section class="group-preview">
    <div>
      <div class="group-header-container">
        <p class="group-title" v-if="!editTitle" @click="editTitle = true">{{ group.title }}</p>
        <textarea v-if="editTitle" v-model="group.title"></textarea>
        <span class="act-btn" @click="openGrpAct = !openGrpAct"><i class="fa-solid fa-ellipsis"></i></span>
        <group-actions @archiveGroup="archiveGroup" @addCard="actionAdd" v-if="openGrpAct" />
      </div>
      <div class="card-preview-container">
        <card-preview v-for="card in group.cards" :key="card.id" :card="card"></card-preview>
        <div class="open-card-container" @click="isAddCard = true" v-if="!isAddCard"><i class="fa-solid fa-plus"></i><span>Add a card</span></div>
        <div class="add-card-container" v-else>
          <textarea @keyup.enter="addCard" autofocus class="add-card-textarea" v-model="cardTitle" placeholder="Enter a title for this card..."></textarea>
          <div class="add-card-actions">
            <button @click="addCard">Add card</button><span @click="isAddCard = false"><i class="fa-solid fa-xmark"></i></span>
          </div>
        </div>
      </div>
      <!-- <button @click="archiveCard(card.id)">Archive card</button> -->

      <!-- <button @click="archiveGroup">Archive group</button> -->
    </div>
  </section>
</template>

<script>
import cardPreview from './card-preview.vue'
import groupActions from './group-actions.vue'

export default {
  name: 'group',
  props: {
    group: Object,
  },
  components: {
    cardPreview,
    groupActions,
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
  },
  computed: {},
}
</script>
