<template>
  <custom-modal v-if="!newLabel" @closeModal="closeModal" @goBack="goBack" class="label-picker">
    <template v-slot:header> Labels </template>
    <input v-focus class="custom-input" type="text" placeholder="Search labels..." />
    <h4>Labels</h4>
    <ul class="labels-container">
      <li v-for="label in labels" :key="label.id" @click="toggleLabel(label.id)">
        <span class="edit-label" @click.stop="startCreating(label)"></span>
        <div class="label-in-label-picker" :class="label.className">
          {{ label.title }}
          <span class="v-icon" v-if="labelIds.includes(label.id)"></span>
        </div>
      </li>
    </ul>
    <button class="custom-btn" @click="startCreating(null)">Create new label</button>
    <hr />
    <button class="custom-btn">Enable color blind friendly mode</button>
  </custom-modal>

  <custom-modal v-if="newLabel && !wantToDelete" @closeModal="closeModal" @goBack="goBack" :isFirstPage="false" class="label-picker">
    <template v-slot:header>{{ titleTxt }}</template>
    <form @submit.prevent="saveLabel" class="form-label">
      <label for="name">Name</label>
      <input v-focus v-model="newLabel.title" id="name" class="custom-input" type="text" />
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
      <button class="add-btn">{{ btnTxt }}</button>
      <div v-if="newLabel.id" class="delete-btn" @click="wantToDelete = true">Delete</div>
    </form>
  </custom-modal>

  <custom-modal v-if="newLabel && wantToDelete" @closeModal="closeModal" @goBack="wantToDelete = false" :isFirstPage="false" class="label-picker delete-mode">
    <template v-slot:header>Delete label?</template>
    <p>There is no undo. This will remove this label from all cards and destroy its history.</p>
    <div class="delete-btn" @click="deleteLabel">Delete</div>
  </custom-modal>
</template>

<script>
import { utilService } from '../../services/util.service'
import customModal from './custom-modal.vue'

export default {
  props: {
    card: Object,
  },
  components: {
    customModal,
  },
  data() {
    return {
      labelIds: JSON.parse(JSON.stringify(this.card.labelIds)),
      newLabel: null,
      selectedColor: 'color0',
      wantToDelete: false,
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
    toggleLabel(labelId) {
      const idx = this.labelIds.findIndex((lId) => lId === labelId)
      if (idx === -1) this.labelIds.push(labelId)
      else this.labelIds.splice(idx, 1)
      this.save()
    },
    startCreating(labelToEdit) {
      if (labelToEdit) {
        this.newLabel = labelToEdit
        this.selectedColor = labelToEdit.className
      } else {
        this.newLabel = {
          title: '',
          className: this.selectedColor,
        }
      }
    },
    changeColor(className) {
      this.newLabel.className = className
      this.selectedColor = className
    },
    async saveLabel() {
      var board = this.$store.getters.currBoard
      var isCreated = false
      if (this.newLabel.id) {
        //edit
        const idx = board.labels.findIndex((l) => l.id === this.newLabel.id)
        board.labels.splice(idx, 1, this.newLabel)
      } else {
        isCreated = true
        const labelIdx = this.labels.findIndex((l) => l.className === this.newLabel.className && l.title === this.newLabel.title)
        if (labelIdx === -1) {
          //create
          this.newLabel.id = utilService.makeId()
          board.labels.push(this.newLabel)
        } else {
          const labelIdIdx = this.labelIds.findIndex((lId) => lId === this.labels[labelIdx].id)
          if (labelIdIdx === -1) this.labelIds.push(this.labels[labelIdx].id)
        }
      }
      await this.$store.dispatch({ type: 'saveBoard', board })
      if (isCreated) {
        this.labelIds.push(this.newLabel.id)
        this.save()
      }
      this.goBack()
    },
    async deleteLabel() {
      var board = this.$store.getters.currBoard
      const idx = board.labels.findIndex((l) => l.id === this.newLabel.id)
      board.labels.splice(idx, 1)
      // delete from all cards
      board.groups = board.groups.map((group) => {
        group.cards = group.cards.map((card) => {
          card.labelIds = card.labelIds.filter((labelId) => labelId !== this.newLabel.id)
          return card
        })
        return group
      })
      await this.$store.dispatch({ type: 'saveBoard', board })
      this.goBack()
      this.wantToDelete = false
    },
    save() {
      this.$emit('updateKey', 'labelIds', JSON.parse(JSON.stringify(this.labelIds)))
    },
  },
  computed: {
    labels() {
      return this.$store.getters.currBoard.labels
    },
    classColors() {
      var classColors = this.$store.getters.labelColors
      classColors.pop()
      return classColors
    },
    emptyColor() {
      return this.$store.getters.labelColors.pop()
    },
    btnTxt() {
      return this.newLabel.id ? 'Save' : 'Create'
    },
    titleTxt() {
      return this.newLabel.id ? 'Change label' : 'Create label'
    },
  },
  unmounted() {},
  emits: ['closeModal', 'updateKey'],
}
</script>
