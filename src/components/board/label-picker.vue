<template>
  <custom-modal v-if="!newLabel" @closeModal="closeModal" @goBack="goBack" :isFirstPage="true">
    <template v-slot:header> Labels </template>
    <input ref="input" class="custom-input" type="search" placeholder="Search labels..." />
    <h4>Labels</h4>
    <ul class="labels-container">
      <li v-for="label in labels" :key="label.id" @click="toggleLabel(label.id)">
        <span class="edit-label"></span>
        <div class="label" :class="label.className">
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

  <custom-modal v-else @closeModal="closeModal" @goBack="goBack" :isFirstPage="false">
    <template v-slot:header> Create label </template>
    <form @submit.prevent="add" class="form-label">
      <label for="name">Name</label>
      <input ref="input" id="name" class="custom-input" type="search" />
      <label for="color">Select a color</label>
      <input type="color" id="color" />
      <button class="create-label-btn">Create</button>
    </form>
    <!-- <ul>
      <li v-for="label in labels" :key="label.id" @click="toggleLabel(label.id)">
        <span :class="label.className">0</span>
        <span>{{ label.title }}</span>
      </li>
    </ul> -->
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'

export default {
  props: {
    currLabelIds: Array,
  },
  components: {
    customModal,
  },
  created() {},
  data() {
    return {
      newLabel: null,
      labelIds: this.currLabelIds,
    }
  },
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
    startCreating() {
      this.newLabel = {
        title: '',
        color: null,
      }
    },
    toggleLabel(labelId) {
      const idx = this.labelIds.findIndex((lId) => lId === labelId)
      if (idx === -1) this.labelIds.push(labelId)
      else this.labelIds.splice(idx, 1)
      this.save()
    },
    // async addLabel() {
    //   await this.$store.dispatch({
    //     type: 'updateCard',
    //     groupId: this.group.id,
    //     cardId: this.card.id,
    //     changes: {
    //       label: { action: 'add', value: 'l107' },
    //     },
    //   })
    // },
    // async removeLabel() {
    //   await this.$store.dispatch({
    //     type: 'updateCard',
    //     groupId: this.group.id,
    //     cardId: this.card.id,
    //     changes: {
    //       label: { action: 'remove', value: 'l107' },
    //     },
    //   })
    // },
    async createLabel() {
      await this.$store.dispatch({
        type: 'updateCard',
        groupId: this.group.id,
        cardId: this.card.id,
        changes: {
          label: { action: 'create', value: this.newLabel },
        },
      })
      this.newLabel = null
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
  },
  unmounted() {},
  // emits: ['removeToy'],
}
</script>
