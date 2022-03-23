<template>
  <custom-modal v-if="!newLabel">
    <template v-slot:header> Labels </template>

    <input type="search" placeholder="Search labels" />

    <ul>
      <li v-for="label in labels" :key="label.id" @click="toggleLabel(label.id)">
        <span :style="{ backgroundColor: label.color }">0</span>
        <span>{{ label.title }}</span>
      </li>
    </ul>

    <button @click="startCreating">Create new label</button>

    <template v-slot:footer> </template>
  </custom-modal>
  
  <custom-modal v-else>
    <template v-slot:header> Create label </template>

    <span>name</span>
    <input type="type"/>

    <span>Select a color</span>
    <!-- <ul>
      <li v-for="label in labels" :key="label.id" @click="toggleLabel(label.id)">
        <span :style="{ backgroundColor: label.color }">0</span>
        <span>{{ label.title }}</span>
      </li>
    </ul> -->

    <button @click="createLabel">Create</button>

    <template v-slot:footer> </template>
  </custom-modal>

</template>

<script>
import customModal from './custom-modal.vue'

export default {
  props: {
    // toy: {
    //   type: Object,
    // },
  },
  components: {
    customModal,
  },
  created() {},
  data() {
    return {
      groupId: '4667',
      cardId: '4667',
      newLabel: null,
    }
  },
  methods: {
    startCreating(){
      this.newLabel = {
        title: '',
        color: null
      }
    },
    async toggleLabel(labelId){
      await this.$store.dispatch({
        type: 'updateCard',
        groupId: this.group.id,
        cardId: this.card.id,
        changes: {
          label: { action: 'toggle', value: labelId },
        },
      })
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
          label: { action: 'create', value: this.newLabel},
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
