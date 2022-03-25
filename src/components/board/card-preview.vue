<template>
  <div @click="openCardEdit" class="card-preview" :class="computedQuickEdit">
    <!-- <labelColor v-for="labelId in card.labelIds" :key="labelId" :labelId="labelId" /> -->
    <span class="card-label-container">
      <span v-for="label in labels" :key="label.id" @click.stop="toggleLabelTitle">
        <span :class="label.className" class="card-label">
          <!-- :class="{ open: labelTitleShown }" -->
          <span v-if="labelTitleShown" class="open">{{ label.title }}</span>
        </span>
      </span>
    </span>
    <span @click.stop="openQuickEdit" class="edit-card"></span>
    <span class="card-preview-title">{{ card.title }}</span>
    <div class="card-icons-container">
      <span>
        <div title="watch" class="icon-div">
          <span class="eyecon"></span>
        </div>
        <div title="description" v-if="card.description" class="icon-div">
          <span class="desc"></span>
        </div>
        <div title="comments" v-if="card.comments.length" class="icon-div">
          <span class="comment"></span>
          <span class="txt">{{card.comments.length}}</span>
        </div>
        <div title="Checklist items" v-if="card.checklists.length" class="icon-div" :class="doneChecklist">
          <span class="check"></span>
          <span class="txt">{{calcProgress()}}</span>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import cardActions from './card-actions.vue'
import cardEdit from './card-edit.vue'

export default {
  name: 'card-preview',
  props: {
    card: Object,
    isQuickEdit: Object
  },
  components: {
    cardActions,
    cardEdit,
  },
  data() {
    return {
      // openActionsMenu: false,
      activeColor: 'red',
      isChecklistDone: false,
    }
  },
  methods: {
    openCardEdit() {
      console.log('open');
      const currRoute = this.$router.currentRoute._value.fullPath
      this.$router.push(`${currRoute}/edit/${this.card.id}`)
    },
    toggleLabelTitle() {
      this.$store.commit({ type: 'toggleLabelTitle' })
    },
    cardOptions(ev) {
      ev.stopPropagation()
    },
    calcProgress() {
      const todosMap = this.card.checklists.reduce((acc, cl)=> {
        const doneTodos = cl.todos.reduce((acc, todo) => {
          if (todo.isDone) acc++
          return acc
        }, 0)
        acc.todosCount += cl.todos.length
        acc.doneTodos += doneTodos
        return acc
      }, {todosCount: 0, doneTodos: 0})
      if (todosMap.todosCount === todosMap.doneTodos) this.isChecklistDone = true
      return `${todosMap.doneTodos}/${todosMap.todosCount}`
    },
    openQuickEdit() {
      this.$emit('openQuickEdit', this.card.id)
    }
  },
  computed: {
    labels() {
      var labels = this.$store.getters.currBoard.labels
      return labels.filter((l) => this.card.labelIds.includes(l.id))
    },
    labelTitleShown() {
      return this.$store.getters.labelTitleShown
    },
    doneChecklist() {
      return (this.isChecklistDone) ? 'completed' : ''
    },
    computedQuickEdit() {
      return (this.isQuickEdit.boolean && this.isQuickEdit.cardId === this.card.id) ? 'quick-card-editor-open' : ''
    }
  },
}
</script>
