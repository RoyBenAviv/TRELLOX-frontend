<template>
  <div @click="openCardEdit" class="card-preview">
    <labelColor v-for="labelId in card.labelIds" :key="labelId" :labelId="labelId"/>
    <span class="edit-card"><i class="fa-solid fa-pen"></i></span>
    <p>{{ card.title }}</p>
    <card-edit @closeModal="closeModal" v-if="isCardOpen" :card="card" />
    <!-- <card-actions v-if="openActionsMenu"></card-actions> -->
  </div>
</template>

<script>
import cardActions from './card-actions.vue'
import cardEdit from './card-edit.vue'
import labelColor from './label-color.vue'

export default {
  name: 'card-preview',
  props: {
    card: Object,
  },
  components: {
    cardActions,
    cardEdit,
    labelColor,
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
      console.log('this.isCardOpen', this.isCardOpen)
    },
  },
  computed: {},
}
</script>
