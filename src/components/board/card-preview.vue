<template>
<section>
  <div @click="openCardEdit" class="card-preview" :class="computedQuickEdit">
    <div v-if="card.style.fullCover" :style="`background: ${card.style.cover}`" class="card-preview-full-cover">
      <div class="card-preview-cover-color"></div>
      <span>{{card.title}}</span>
      <span @click.stop="openQuickEdit" class="edit-card"></span>
    </div>
    <div v-else style="width: 100%">
    <div v-if="card.style.cover" class="card-preview-cover">
      <img class="card-image" v-if="card.style.type === 'url'" :src="card.style.cover" />
      <div v-else class="card-preview-cover-color" :style="`background-color: ${card.style.cover}`"></div>
    </div>
    <img class="card-image" v-if="card.attachments.length && !card.style.cover" :src="card.attachments[0].url" />
    <div class="card-label-container">
      <span v-for="label in labels" :key="label.id" @click.stop="toggleLabelTitle" :class="[label.className, labelTitleShown]" class="card-label" :title="label.title">
          <span v-if="labelTitleShown">{{ label.title }}</span>
        </span>
      </div>
      <span @click.stop="openQuickEdit" class="edit-card"></span>
      <textarea v-if="checkQuickEdit" v-model="newTitle" v-focus @focus="$event.target.select()" @keydown.prevent.enter="updateTitle"></textarea>
      <span v-else class="card-preview-title">{{ card.title }}</span>
      <div class="card-icons-container">
        <div>
          <!-- <div title="watch" class="icon-div">
            <span class="eyecon"></span>
          </div> -->
          <div title="description" v-if="card.description" class="icon-div">
            <span class="desc"></span>
          </div>
          <div title="comments" v-if="card.comments.length" class="icon-div">
            <span class="comment"></span>
            <span class="txt">{{ card.comments.length }}</span>
          </div>
          <div title="attachments" v-if="card.attachments.length" class="icon-div">
            <span class="attachment"></span>
            <span class="txt">{{ card.attachments.length }}</span>
          </div>
          <div title="Checklist items" v-if="card.checklists.length" class="icon-div" :class="doneChecklist">
            <span class="check"></span>
            <span class="txt">{{ calcProgress() }}</span>
          </div>
          <div class="avatar-container" v-for="member in members" :key="member.id" :title="member.fullname">
            <img v-if="member.imgUrl" :src="member.imgUrl" alt="" />
            <span v-else>{{ member.fullname.split(' ')[0].split('')[0] + member.fullname.split(' ')[1].split('')[0] }}</span>
          </div>
        </div>
      </div>
      <button v-if="checkQuickEdit" class="save-quick-edit" @click.stop="updateTitle">Save</button>
    </div>
    </div>
  </section>
</template>

<script>
import cardActions from './card-actions.vue'
import cardEdit from './card-edit.vue'

export default {
  name: 'card-preview',
  props: {
    card: Object,
    isQuickEdit: Object,
    groupId: String,
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
      newTitle: '',
    }
  },
  methods: {
    openCardEdit() {
      if (this.isQuickEdit.boolean) return
      const currRoute = this.$router.currentRoute._value.fullPath
      this.$router.push(`${currRoute}/edit/${this.card.id}`)
    },
    toggleLabelTitle() {
      this.$store.commit({ type: 'toggleLabelTitle' })
    },
    calcProgress() {
      const todosMap = this.card.checklists.reduce(
        (acc, cl) => {
          const doneTodos = cl.todos.reduce((acc, todo) => {
            if (todo.isDone) acc++
            return acc
          }, 0)
          acc.todosCount += cl.todos.length
          acc.doneTodos += doneTodos
          return acc
        },
        { todosCount: 0, doneTodos: 0 }
      )
      if (todosMap.todosCount === todosMap.doneTodos) this.isChecklistDone = true
      return `${todosMap.doneTodos}/${todosMap.todosCount}`
    },
    openQuickEdit() {
      this.newTitle = JSON.parse(JSON.stringify(this.card.title))
      this.$emit('openQuickEdit', this.card.id)
    },
    updateTitle() {
      if (!this.newTitle) return
      const card = JSON.parse(JSON.stringify(this.card))
      card.title = this.newTitle
      this.$store.dispatch({ type: 'updateCard', groupId: this.groupId, card })
      this.$emit('closeQuickEdit')
    },
  },
  computed: {
    labels() {
      var labels = this.$store.getters.currBoard.labels
      labels = labels.filter(({ className }) => className !== 'color10')
      return labels.filter((l) => this.card.labelIds.includes(l.id))
    },
    labelTitleShown() {
      return this.$store.getters.labelTitleShown ? 'open' : ''
    },
    doneChecklist() {
      return this.isChecklistDone ? 'completed' : ''
    },
    computedQuickEdit() {
      return this.isQuickEdit.boolean && this.isQuickEdit.cardId === this.card.id ? 'quick-card-editor-open' : ''
    },
    checkQuickEdit() {
      return this.isQuickEdit.boolean && this.isQuickEdit.cardId === this.card.id
    },
    members() {
      var members = this.$store.getters.currBoard.members
      return members.filter((m) => this.card.memberIds.includes(m._id))
    },
  },
}
</script>
