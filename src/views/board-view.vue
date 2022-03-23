<template>
  <section v-if="board" class="board-view">
      <h1>{{ board.title }}</h1>
    <div class="card-container">
      <div v-for="list in board.lists" :key="list.id">
        <list-preview :list="list"></list-preview>
      </div>
      <button @click="isAddList = true" v-if="!isAddList">Add new list</button>
      <div v-else>
        <input v-model="listTitle" type="text" placeholder="Enter list title" />
        <button @click="addList">Add List</button>
      </div>
    </div>
  </section>

</template>

<script>
import listPreview from '../components/list-preview.vue'


export default {
  name: 'cmp name',
  components: {
    listPreview,
  },
  data() {
    return {
      isAddList: false,
      listTitle: '',
    }
  },
  async created() {
    const { boardId } = this.$route.params
    await this.$store.dispatch({ type: 'setCurrBoard', boardId })
  },
  methods: {
    addList() {
      this.$store.dispatch({ type: 'addList', title: this.listTitle})
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
