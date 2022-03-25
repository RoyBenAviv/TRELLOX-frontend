<template>
  <section class="workspace-view">
    <app-header class="workspace-header" />
    <div class="workspace-wrapper main-layout">
      <nav class="workspace-nav">
        <ul class="nav-options-top">
          <li><a>Home</a></li>
          <li><i class="fa-brands fa-trello"></i><a>Boards</a></li>
          <li><a>Create Workspace</a></li>
        </ul>
      </nav>
      <div class="board-list-container">
        <div class="recently-viewed">
          <h2>Recently viewed</h2>
          <board-list :boards="boards" />
        </div>
        <!-- <div class="your-workspaces">
          <h2>your workspaces</h2>
          <board-list :boards="boards" />
          <div class="create-board"><p>Create new board</p></div>
        </div> -->
      </div>
    </div>
  </section>
</template>

<script>
import boardList from '../components/workspace/board-list.vue'
import AppHeader from '../components/app-header.vue'

export default {
  name: 'workspace-view',
  components: {
    boardList,
    AppHeader,
  },
  data() {
    return {}
  },
  methods: {},
  computed: {
    boards() {
      return this.$store.getters.boards
    },
  },
}
</script>
