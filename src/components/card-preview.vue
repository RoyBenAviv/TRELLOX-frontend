<template>
  <div @click="openCardEdit" class="card-container">
    <p>{{ card.title }}</p>
    <card-edit @closeModal="closeModal" v-if="isCardOpen" :card="card"/>
    <!-- <card-actions v-if="openActionsMenu"></card-actions> -->
    <span v-for="id in card.labelIds" :key="id">
      {{ id }}
    </span>
  </div>
</template>

<script>
import cardActions from './card-actions.vue'
import cardEdit from './card-edit.vue'
export default {
  name: 'card-preview',
  props: {
    card: Object,
  },
  components: {
    cardActions,
    cardEdit,
  },
  data() {
    return {
      isCardOpen: false,
      // openActionsMenu: false,
    }
  },
  methods: {
    openCardEdit() {
        this.isCardOpen = true
    },
    closeModal() {
      this.isCardOpen = false
      console.log('this.isCardOpen',this.isCardOpen);
    }
  },
}
</script>
