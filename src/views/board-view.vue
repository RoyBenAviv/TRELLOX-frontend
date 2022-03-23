<template>
  <section v-if="board" class="board-view">
      <h1>{{ board.title }}</h1>
    <div class="card-container">
      <group-preview v-for="group in board.groups" :key="group.id" :group="group"></group-preview>
      <button @click="isAddGroup = true" v-if="!isAddGroup">Add new group</button>
      <div v-else>
        <input v-model="groupTitle" type="text" placeholder="Enter group title" />
        <button @click="addGroup">Add Group</button>
      </div>
    </div>
  </section>

</template>

<script>
import groupPreview from '../components/group-preview.vue'


export default {
  components: {
    groupPreview,
  },
  data() {
    return {
      isAddGroup: false,
      groupTitle: '',
    }
  },
  async created() {
    const { boardId } = this.$route.params
    await this.$store.dispatch({ type: 'setCurrBoard', boardId })
  },
  methods: {
    addGroup() {
      this.$store.dispatch({ type: 'addGroup', title: this.groupTitle})
    },
  },
  computed: {
    board() {
      return this.$store.getters.getCurrBoard
    }
  },
  unmounted() {},
}
</script>
