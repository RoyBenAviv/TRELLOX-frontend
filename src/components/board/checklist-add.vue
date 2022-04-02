<template>
  <custom-modal @closeModal="closeModal">
    <template v-slot:header> Add checklist </template>
    <h4>Title</h4>
    <input v-model="checklist.title" v-focus class="custom-input" type="text" />
    <!-- <h4>Copy items from...</h4>
    <p>to put here dropdown select</p> -->
    <button class="add-btn" @click="save">Add</button>
  </custom-modal>
</template>

<script>
import customModal from './custom-modal.vue'

export default {
  name: '',
  data() {
    return {
      checklist: {
        title: 'Checklist',
        newTodo: '',
        todos: [],
      },
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    save() {
      if(!this.checklist.title) return
      this.$emit('updateKey', 'checklists', JSON.parse(JSON.stringify(this.checklist)), `added checklist ${this.checklist.title}`)
      this.$emit('closeModal')
    },
  },
  computed: {},
  components: {
    customModal,
  },
}
</script>

<style></style>
