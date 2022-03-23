<template>
  <div @click="openCardEdit" class="card-preview">
    <!-- <labelColor v-for="labelId in card.labelIds" :key="labelId" :labelId="labelId" /> -->
    <span class="card-label-container">
      <span v-for="label in labels" :key="label.id" @click.stop="toggleLabelTitle">
        <span :style="{ backgroundColor: label.color }" class="card-label" :class="{ open: labelTitleShown }">
          <span v-if="labelTitleShown">{{ label.title }}</span>
        </span>
        <!-- <pre>{{label.color}}</pre> -->
      </span>
    </span>
    <span class="edit-card"><i class="fa-solid fa-pen"></i></span>
    <p>{{ card.title }}</p>
    <card-edit @closeModal="closeModal" v-if="isCardOpen" :card="card" />
    <!-- <card-actions v-if="openActionsMenu"></card-actions> -->
  </div>
</template>

<script>
import cardActions from './card-actions.vue'
import cardEdit from './card-edit.vue'
// import labelColor from './label-color.vue'

export default {
  name: 'card-preview',
  props: {
    card: Object,
  },
  components: {
    cardActions,
    cardEdit,
    // labelColor,
  },
  data() {
    return {
      isCardOpen: false,
      // openActionsMenu: false,
      activeColor: 'red',
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
    toggleLabelTitle() {
      console.log('toggeling')
      this.$store.commit({ type: 'toggleLabelTitle' })
    },
  },
  computed: {
    labels() {
      var labels = this.$store.getters.currBoard.labels
      return labels.filter((l) => this.card.labelIds.includes(l.id))
    },
    labelTitleShown() {
      return this.$store.getters.labelTitleShown
    },
  },
}
</script>
