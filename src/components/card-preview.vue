<template>
  <div @click="openCardEdit" class="card-container">
    <p>{{ card.title }}</p>
    <card-edit v-if="isCardOpen" :card="card"/>
    <!-- <card-actions v-if="openActionsMenu"></card-actions> -->
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
    cardEdit
  },
  data() {
    return {
      isCardOpen: false
      // openActionsMenu: false,
    }
  },
  methods: {
    openCardEdit() {
        this.isCardOpen = true
    }
  },
<<<<<<< HEAD
  methods: {
  },
=======
>>>>>>> 74499e37f9a858c32a85186292cfda394d5e1521
  computed: {},

}
</script>
