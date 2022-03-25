<template>
 <custom-modal @closeModal="closeModal">
    <template v-slot:header> Add checklist </template>
    <h4>Title</h4>
    <input v-model="checklist.title" ref="input" class="custom-input" type="text" />
    <h4>Copy items from...</h4>
    <p>to put here dropdown select</p>
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
     todos: []
 }
};
 },
methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    focusInput() {
      this.$refs.input.focus()
    },
    save() {
      this.$emit('updateKey', 'checklists', JSON.parse(JSON.stringify(this.checklist)))
    },
},
computed: {
},
components: {
    customModal
}
};
</script>
 
<style>
 
</style>