<template>
  <custom-modal v-if="!newLabel" @closeModal="closeModal" @goBack="goBack" :isFirstPage="true" class="label-picker">
    <template v-slot:header> Labels </template>
    <input ref="input" class="custom-input" type="search" placeholder="Search labels..." />
    <h4>Labels</h4>
    <ul class="labels-container">
      <li v-for="label in labels" :key="label.id" @click="toggleLabel(label.id)">
        <span class="edit-label"></span>
        <div class="label-in-label-picker" :class="label.className">
          {{ label.title }}
          <span class="v-icon" v-if="labelIds.includes(label.id)"></span>
        </div>
      </li>
    </ul>
    <!-- {{labelIds}} -->
    <button class="custom-btn" @click="startCreating">Create new label</button>
    <hr />
    <button class="custom-btn">Enable color blind friendly mode</button>
  </custom-modal>

  <custom-modal v-else @closeModal="closeModal" @goBack="goBack" :isFirstPage="false" class="label-picker">
    <template v-slot:header> Create label </template>
    <form @submit.prevent="createLabel" class="form-label">
      <label for="name">Name</label>
      <input ref="input" v-model="newLabel.title" id="name" class="custom-input" type="search" />
      <label for="color">Select a color</label>
      <div>
        <span v-for="classColor in classColors" :key="classColor" :class="classColor" class="colorPalette" @click="changeColor(classColor)">
          <span v-if="selectedColor === classColor" class="v-icon"></span>
        </span>
      </div>
      <div class="empty-card-container">
        <span :class="emptyColor" class="colorPalette" @click="changeColor(emptyColor)">
          <span v-if="selectedColor === emptyColor" class="v-icon"></span>
        </span>
        <div>
          <p>No color.</p>
          <p>This won't show up on the front of cards.</p>
        </div>
      </div>
      <button class="add-btn">Create</button>
    </form>
  </custom-modal>
</template>

<script>
import { utilService } from '../../services/util.service'
import customModal from './custom-modal.vue'

export default {
  props: {
    currLabelIds: Array,
  },
  components: {
    customModal,
  },
  data() {
    return {
      labelIds: this.currLabelIds,
      newLabel: null,
      selectedColor: null,
    }
  },
  created() {},
  methods: {
    goBack() {
      this.newLabel = null
    },
    closeModal() {
      this.$emit('closeModal')
    },
    focusInput() {
      this.$refs.input.focus()
    },
    toggleLabel(labelId) {
      const idx = this.labelIds.findIndex((lId) => lId === labelId)
      if (idx === -1) this.labelIds.push(labelId)
      else this.labelIds.splice(idx, 1)
      this.save()
    },
    startCreating() {
      this.newLabel = {
        title: '',
        className: null,
      }
    },
    changeColor(className) {
      this.newLabel.className = className
      this.selectedColor = className
    },
    async createLabel() {
      this.newLabel.id = utilService.makeId()
      var board = this.$store.getters.currBoard
      board.labels.push(this.newLabel)
      await this.$store.dispatch({type: 'saveBoard', board})
      this.toggleLabel(this.newLabel.id)
      this.goBack()
    },
    async editLabel() {
      await this.$store.dispatch({
        type: 'updateCard',
        groupId: this.group.id,
        cardId: this.card.id,
        changes: {
          label: { action: 'edit', value: { color: '$label0', id: 'l101', title: 'SHANI!! Request' } },
        },
      })
    },
    async deleteLabel() {
      await this.$store.dispatch({
        type: 'updateCard',
        groupId: this.group.id,
        cardId: this.card.id,
        changes: {
          label: { action: 'delete', value: 'l101' },
        },
      })
    },
    save() {
      this.$emit('updateKey', 'labelIds', JSON.parse(JSON.stringify(this.labelIds)))
    },
  },
  computed: {
    labels() {
      return this.$store.getters.currBoard.labels
    },
    classColors(){
      var classColors = this.$store.getters.labelColors
      classColors.pop()
      return classColors
    },
    emptyColor(){
      return this.$store.getters.labelColors.pop()
    },
  },
  unmounted() {},
  // emits: ['removeToy'],
}
</script>
