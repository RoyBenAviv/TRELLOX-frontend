<template>
  <section>
    <board-list :boards="boards"/>
  </section>
</template>

<script>
import boardList from '../components/board-list.vue'

export default {
  name: 'workspace-view',
  components: {
    boardList
  },
  data() {
    return {}
  },
  methods: {},
  computed: {
    boards() {
      return this.$store.getters.getBoards
    }
  }
}
</script>