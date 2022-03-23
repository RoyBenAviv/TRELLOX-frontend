<template>
  <div @click="openCardEdit" class="card-preview">
    <!-- <labelColor v-for="labelId in card.labelIds" :key="labelId" :labelId="labelId" /> -->
    <span v-for="label in labels" :key="label.id" @click="toggleLabelTitle">
      <span :style="{ backgroundColor: label.color }">0</span>
      <span v-if="labelTitleShown">{{ label.title }}</span>
    </span>
    <span class="edit-card"><i class="fa-solid fa-pen"></i></span>
    <p>{{ card.title }}</p>
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
      // openActionsMenu: false,
    }
  },
  methods: {
    openCardEdit() {
      const currRoute = this.$router.currentRoute._value.fullPath
      this.$router.push(`${currRoute}/edit/${this.card.id}`)
    },
    toggleLabelTitle(){
      this.$store.commit({ type: 'toggleLabelTitle' })
    },
  },
  computed: {
    labels() {
      var labels = this.$store.getters.currBoard.labels
      return labels.find((l) => this.card.labelIds.includes(l.id))
    },
    labelTitleShown() {
      return this.$store.getters.labelTitleShown
    },
  },
}
</script>
