<template>
  <section v-if="board" class="board-view">
    <h1>{{ board.title }}</h1>
    <main>
      <article  v-for="list in board.lists" :key="list.id">
        <list-cmp :list="list"></list-cmp>
      </article>
    </main>
  </section>
</template>

<script>
import listCmp from '../components/list-cmp.vue'

export default {
  name: 'cmp name',
  components: {
    listCmp,
  },
    data() {
    return {
      board: null
    }
  },
  async created() {
    const { boardId } = this.$route.params
    this.board = await this.$store.dispatch({type: 'setCurrBoard', boardId})
  },
  methods: {

  },
  computed: {

  },
  unmounted() {},
}
</script>
