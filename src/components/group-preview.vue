<template>
  <section class="group-preview">
    <div class="group-container">
      <textarea>{{ group.title }}</textarea>
      <div v-for="card in group.cards" :key="card.id">
        <card-preview :card="card"></card-preview>
        <button @click="archiveCard(card.id)">Archive card</button>
        <button @click="addLabel(card.id, 'l109')">connect lable</button>
        <button @click="removeLabel(card.id, 'l109')">remove lable</button>
      </div>
      <button @click="isAddCard = true" v-if="!isAddCard">Add new card</button>
      <div v-else>
        <input v-model="cardTitle" type="text" placeholder="Enter card title" />
        <button @click="addCard">Add card</button>
      </div>
      <button @click="archiveGroup">Archive group</button>
    </div>
  </section>
</template>

<script>
import cardPreview from './card-preview.vue'

export default {
  name: 'group',
  props: {
    group: Object,
  },
  components: {
    cardPreview,
  },
  created() {},
  data() {
    return {
      isAddCard: false,
      cardTitle: '',
    }
  },
  methods: {
    addCard() {
      this.$store.dispatch({ type: 'addCard', groupId: this.group.id, title: this.cardTitle })
    },
    archiveGroup() {
      this.$store.dispatch({ type: 'archiveGroup', groupId: this.group.id })
    },
    archiveCard(cardId) {
      this.$store.dispatch({ type: 'archiveCard', groupId: this.group.id, cardId })
    },
    addLabel(cardId, labelId) {
      this.$store.dispatch({
        type: 'updateCard',
        groupId: this.group.id,
        cardId,
        changes: {
          label: { action: 'add', value: labelId },
        },
      })
    },
    removeLabel(cardId, labelId) {
      this.$store.dispatch({
        type: 'updateCard',
        groupId: this.group.id,
        cardId,
        changes: {
          label: { action: 'remove', value: labelId },
        },
      })
    },
  },
  computed: {},
  unmounted() {},
}
</script>
