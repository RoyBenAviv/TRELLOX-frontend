<template>
  <section class="list-preview">
      <h2>{{list.title}}</h2>
      <div v-for="card in list.cards" :key="card.id">
          <card-preview :card="card"></card-preview>
          <button @click="archiveCard(card.id)">Archive card</button>
      </div>
      <button @click="isAddCard = true" v-if="!isAddCard">Add new card</button>
      <div v-else>
        <input v-model="cardTitle" type="text" placeholder="Enter card title" />
        <button @click="addCard">Add card</button>
      </div>
      <button @click="archiveList">Archive list</button>
  </section>
</template>

<script>
import cardPreview from './card-preview.vue'

export default {
  name: 'list',
  props: {
    list: Object,
  },
  components: {
      cardPreview
  },
  created() {},
  data() {
    return {
        isAddCard: false,
        cardTitle: ''
    }
  },
  methods: {
    addCard() {
      this.$store.dispatch({ type: 'addCard', listId: this.list.id, title: this.cardTitle})
    },
    archiveList() {
      this.$store.dispatch({type: 'archiveList', listId: this.list.id})
    },
    archiveCard(cardId) {
      this.$store.dispatch({type: 'archiveCard', listId: this.list.id, cardId})
    }
  },
  computed: {},
  unmounted() {

  },
}
</script>
